// auth.js — login, logout, troca de senha

// ============================================================
// LOGIN
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

  // Carrega permissões em memória logo após autenticar
  const permissoes = await carregarPermissoes(usuario.id);

  window.usuarioAtual = {
    id:            usuario.id,
    username:      usuario.username,
    papel:         usuario.papeis.nome,
    primeiroLogin: usuario.primeiro_login,
    permissoes,          // { "funcionarios.ler": "RBAC", "relatorios.criar": "ACL", ... }
  };

  if (usuario.primeiro_login) {
    mostrarTela("tela-trocar-senha");
    document.getElementById("aviso-primeiro-login").classList.remove("hidden");
    return;
  }

  entrarNoApp();
}

// ============================================================
// CARREGA TODAS AS PERMISSÕES DO USUÁRIO DE UMA VEZ
// Faz poucas queries e monta um mapa em memória
// Evita o loop de queries individuais no app.js
// ============================================================
async function carregarPermissoes(usuarioId) {
  const mapa = {}; // chave: "recurso.acao" → valor: origem

  // Busca papel do usuário
  const { data: usuario } = await db
    .from("usuarios")
    .select("papel_id")
    .eq("id", usuarioId)
    .single();

  // Busca todas as permissões RBAC do papel (uma query só)
  const { data: rbacList } = await db
    .from("rbac_permissoes")
    .select("acao, recursos(nome)")
    .eq("papel_id", usuario.papel_id);

  (rbacList || []).forEach(({ acao, recursos }) => {
    const chave = recursos.nome + "." + acao;
    if (!mapa[chave]) mapa[chave] = "RBAC (papel)";
  });

  // Busca todas as permissões ACL do usuário (uma query só)
  const { data: aclList } = await db
    .from("acl_permissoes")
    .select("acao, recursos(nome)")
    .eq("usuario_id", usuarioId);

  // ACL sobrescreve RBAC (tem prioridade)
  (aclList || []).forEach(({ acao, recursos }) => {
    const chave = recursos.nome + "." + acao;
    mapa[chave] = "ACL (individual)";
  });

  return mapa;
}

// ============================================================
// CONSULTA PERMISSÃO — síncrona, sem query (usa o mapa em memória)
// ============================================================
function pode(recurso, acao) {
  return !!(window.usuarioAtual?.permissoes?.[recurso + "." + acao]);
}

function origemPermissao(recurso, acao) {
  return window.usuarioAtual?.permissoes?.[recurso + "." + acao] || "Negado";
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
// TROCAR SENHA — primeiro login
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
  document.getElementById("inp-perfil-nova").value      = "";
  document.getElementById("inp-perfil-confirmar").value = "";
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
function inicializar() {
  mostrarTela("tela-login");
}
window.addEventListener("DOMContentLoaded", inicializar);
