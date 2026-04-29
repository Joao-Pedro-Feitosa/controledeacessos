// senha.js — validação de senha e fluxos de alteração

// ============================================================
// VALIDAÇÃO DE SENHA
// Critérios: mín. 12 caracteres, 1 maiúscula, 1 minúscula,
//            1 número, 1 caractere especial
// ============================================================
function validarSenha(senha) {
  const erros = [];

  if (senha.length < 12)
    erros.push("Mínimo de 12 caracteres");
  if (!/[A-Z]/.test(senha))
    erros.push("Pelo menos 1 letra maiúscula");
  if (!/[a-z]/.test(senha))
    erros.push("Pelo menos 1 letra minúscula");
  if (!/[0-9]/.test(senha))
    erros.push("Pelo menos 1 número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha))
    erros.push("Pelo menos 1 caractere especial (!@#$%...)");

  return erros; // array vazio = senha válida
}

// Renderiza os critérios em tempo real enquanto o usuário digita
function renderizarCriterios(senha, elementoId) {
  const el = document.getElementById(elementoId);
  if (!el) return;

  const criterios = [
    { label: "Mínimo 12 caracteres",      ok: senha.length >= 12 },
    { label: "1 letra maiúscula (A-Z)",    ok: /[A-Z]/.test(senha) },
    { label: "1 letra minúscula (a-z)",    ok: /[a-z]/.test(senha) },
    { label: "1 número (0-9)",             ok: /[0-9]/.test(senha) },
    { label: "1 caractere especial",       ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha) },
  ];

  el.innerHTML = criterios
    .map(c => `<span class="${c.ok ? 'ok' : 'err'}">${c.ok ? "✔" : "✘"} ${c.label}</span>`)
    .join("<br>");
}

// ============================================================
// ALTERAR SENHA (usuário já logado)
// ============================================================
async function alterarSenha(novaSenha, confirmarSenha) {
  if (novaSenha !== confirmarSenha)
    return { erro: "As senhas não coincidem." };

  const erros = validarSenha(novaSenha);
  if (erros.length > 0)
    return { erro: erros.join(" | ") };

  const { error } = await db.auth.updateUser({ password: novaSenha });

  if (error) return { erro: "Erro ao alterar senha: " + error.message };

  // Marca no banco que o usuário já definiu a senha permanente
  const { data: { user } } = await db.auth.getUser();
  await db.from("usuarios").update({ primeiro_login: false }).eq("auth_id", user.id);

  return { ok: true };
}

// ============================================================
// ESQUECI MINHA SENHA — envia email de reset
// ============================================================
async function esqueceuSenha(email) {
  if (!email) return { erro: "Informe o email." };

  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/index.html?modo=reset",
  });

  if (error) return { erro: "Erro: " + error.message };
  return { ok: true };
}
