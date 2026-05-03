// auth.js

async function doLogin() {
  const username = document.getElementById("inp-user").value.trim();
  const senha    = document.getElementById("inp-pass").value;
  const errEl    = document.getElementById("login-err");
  errEl.textContent = "Verificando...";

  const { data: usuario, error } = await db
    .from("usuarios")
    .select("id, username, senha, cargo, ativo, primeiro_login")
    .eq("username", username)
    .single();

  if (error || !usuario) { errEl.textContent = "Usuário não encontrado."; return; }
  if (!usuario.ativo)     { errEl.textContent = "Usuário inativo. Contate o administrador."; return; }
  if (usuario.senha !== senha) { errEl.textContent = "Senha incorreta."; return; }

  errEl.textContent = "";

  const permissoes = await carregarPermissoes(usuario.id);

  window.usuarioAtual = {
    id:            usuario.id,
    username:      usuario.username,
    cargo:         usuario.cargo || "Sem cargo",
    primeiroLogin: usuario.primeiro_login,
    permissoes,
  };

  if (usuario.primeiro_login) {
    mostrarTela("tela-trocar-senha");
    document.getElementById("aviso-primeiro-login").classList.remove("hidden");
    return;
  }

  entrarNoApp();
}

async function carregarPermissoes(usuarioId) {
  const { data } = await db
    .from("permissoes_usuario")
    .select("funcao")
    .eq("usuario_id", usuarioId)
    .eq("permitido", true);

  const mapa = {};
  (data || []).forEach(({ funcao }) => { mapa[funcao] = true; });
  return mapa;
}

function pode(funcao) {
  return !!(window.usuarioAtual?.permissoes?.[funcao]);
}

function doLogout() {
  window.usuarioAtual = null;
  mostrarTela("tela-login");
  document.getElementById("inp-pass").value = "";
}

async function doTrocarSenha() {
  const nova      = document.getElementById("inp-nova-senha").value;
  const confirmar = document.getElementById("inp-confirmar-senha").value;
  const errEl     = document.getElementById("trocar-err");
  const okEl      = document.getElementById("trocar-ok");
  errEl.textContent = ""; okEl.textContent = "";

  const resultado = await alterarSenha(nova, confirmar);
  if (resultado.erro) { errEl.textContent = resultado.erro; return; }

  okEl.textContent = "Senha definida! Entrando...";
  setTimeout(() => { window.usuarioAtual.primeiroLogin = false; entrarNoApp(); }, 1200);
}

async function doAlterarSenhaPerfil() {
  const nova      = document.getElementById("inp-perfil-nova").value;
  const confirmar = document.getElementById("inp-perfil-confirmar").value;
  const errEl     = document.getElementById("perfil-err");
  const okEl      = document.getElementById("perfil-ok");
  errEl.textContent = ""; okEl.textContent = "";

  const resultado = await alterarSenha(nova, confirmar);
  if (resultado.erro) { errEl.textContent = resultado.erro; return; }

  okEl.textContent = "Senha alterada com sucesso!";
  document.getElementById("inp-perfil-nova").value      = "";
  document.getElementById("inp-perfil-confirmar").value = "";
}

function mostrarTela(idTela) {
  ["tela-login","tela-trocar-senha","tela-app"].forEach(id => {
    document.getElementById(id)?.classList.add("hidden");
  });
  document.getElementById(idTela)?.classList.remove("hidden");
}

function inicializar() { mostrarTela("tela-login"); }
window.addEventListener("DOMContentLoaded", inicializar);
