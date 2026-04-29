// auth.js — login, logout, troca de senha

// ============================================================
// LOGIN — busca usuário no banco e compara senha em texto puro
// ============================================================
async function doLogin() {
  const username = document.getElementById("inp-user").value.trim();
  const senha    = document.getElementById("inp-pass").value;
  const errEl    = document.getElementById("login-err");

  errEl.textContent = "Verificando...";

  const { data: usuario, error } = await db
    .from("usuarios")
    .select("id, username, senha, primeiro_login, ativo, papeis(nome)")
    .eq("username", username)
    .single();

  if (error || !usuario) {
    errEl.textContent = "Usuário não encontrado.";
    return;
  }

  if (!usuario.ativo) {
    errEl.textContent = "Usuário inativo. Contate o administrador.";
    return;
  }

  if (usuario.senha !== senha) {
    errEl.textContent = "Senha incorreta.";
    return;
  }

  errEl.textContent = "";

  window.usuarioAtual = {
    id:           usuario.id,
    username:     usuario.username,
    papel:        usuario.papeis.nome,
    primeiroLogin: usuario.primeiro_login,
  };

  // Primeiro login → força troca de senha
  if (usuario.primeiro_login) {
    mostrarTela("tela-trocar-senha");
    document.getElementById("aviso-primeiro-login").classList.remove("hidden");
    return;
  }

  entrarNoApp();
}

// ============================================================
// LOGOUT
// ============================================================
function doLogout() {
  window.usuarioAtual = null;
  mostrarTela("tela-login");
  document.getElementById("inp-pass").value = "";
}

// ============================================================
// TROCAR SENHA — primeiro login ou perfil
// ============================================================
async function doTrocarSenha() {
  const nova      = document.getElementById("inp-nova-senha").value;
  const confirmar = document.getElementById("inp-confirmar-senha").value;
  const errEl     = document.getElementById("trocar-err");
  const okEl      = document.getElementById("trocar-ok");

  errEl.textContent = "";
  okEl.textContent  = "";

  const resultado = await alterarSenha(nova, confirmar);

  if (resultado.erro) {
    errEl.textContent = resultado.erro;
    return;
  }

  okEl.textContent = "Senha definida com sucesso! Entrando...";
  setTimeout(() => {
    window.usuarioAtual.primeiroLogin = false;
    entrarNoApp();
  }, 1200);
}

// ============================================================
// ALTERAR SENHA — usuário já logado (página perfil)
// ============================================================
async function doAlterarSenhaPerfil() {
  const nova      = document.getElementById("inp-perfil-nova").value;
  const confirmar = document.getElementById("inp-perfil-confirmar").value;
  const errEl     = document.getElementById("perfil-err");
  const okEl      = document.getElementById("perfil-ok");

  errEl.textContent = "";
  okEl.textContent  = "";

  const resultado = await alterarSenha(nova, confirmar);

  if (resultado.erro) {
    errEl.textContent = resultado.erro;
    return;
  }

  okEl.textContent = "Senha alterada com sucesso!";
  document.getElementById("inp-perfil-nova").value     = "";
  document.getElementById("inp-perfil-confirmar").value = "";
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
function inicializar() {
  mostrarTela("tela-login");
}

window.addEventListener("DOMContentLoaded", inicializar);
