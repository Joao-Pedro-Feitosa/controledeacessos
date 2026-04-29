// senha.js — validação de senha e alteração

// ============================================================
// VALIDAÇÃO
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
  return erros;
}

// Renderiza critérios em tempo real enquanto o usuário digita
function renderizarCriterios(senha, elementoId) {
  const el = document.getElementById(elementoId);
  if (!el) return;

  const criterios = [
    { label: "Mínimo 12 caracteres",   ok: senha.length >= 12 },
    { label: "1 letra maiúscula (A-Z)", ok: /[A-Z]/.test(senha) },
    { label: "1 letra minúscula (a-z)", ok: /[a-z]/.test(senha) },
    { label: "1 número (0-9)",          ok: /[0-9]/.test(senha) },
    { label: "1 caractere especial",    ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha) },
  ];

  el.innerHTML = criterios
    .map(c => `<span class="${c.ok ? 'ok' : 'err'}">${c.ok ? "✔" : "✘"} ${c.label}</span>`)
    .join("<br>");
}

// ============================================================
// ALTERAR SENHA — salva direto na tabela usuarios
// ============================================================
async function alterarSenha(novaSenha, confirmarSenha) {
  if (novaSenha !== confirmarSenha)
    return { erro: "As senhas não coincidem." };

  const erros = validarSenha(novaSenha);
  if (erros.length > 0)
    return { erro: erros.join(" | ") };

  const { error } = await db
    .from("usuarios")
    .update({ senha: novaSenha, primeiro_login: false })
    .eq("id", window.usuarioAtual.id);

  if (error) return { erro: "Erro ao salvar senha: " + error.message };

  return { ok: true };
}
