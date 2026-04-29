// auth.js — login, logout, sessão, detecção de primeiro login

// ============================================================
// LOGIN
// ============================================================
async function doLogin() {
  const email = document.getElementById("inp-email").value.trim();
  const senha  = document.getElementById("inp-pass").value.trim();
  const errEl  = document.getElementById("login-err");

  errEl.textContent = "Verificando...";

  const { data, error } = await db.auth.signInWithPassword({ email, password: senha });

  if (error) {
    errEl.textContent = "Email ou senha inválidos.";
    return;
  }

  errEl.textContent = "";

  // Verifica se é primeiro login (senha temporária)
  const { data: usuario } = await db
    .from("usuarios")
    .select("id, username, primeiro_login, papeis(nome)")
    .eq("auth_id", data.user.id)
    .single();

  if (!usuario) {
    errEl.textContent = "Usuário não encontrado na base de dados.";
    await db.auth.signOut();
    return;
  }

  // Armazena estado global
  window.usuarioAtual = {
    id:           usuario.id,
    authId:       data.user.id,
    username:     usuario.username,
    email:        data.user.email,
    papel:        usuario.papeis.nome,
    primeiroLogin: usuario.primeiro_login,
  };

  // Se for primeiro login ou senha temporária → força troca de senha
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
async function doLogout() {
  await db.auth.signOut();
  window.usuarioAtual = null;
  mostrarTela("tela-login");
  document.getElementById("inp-pass").value = "";
}

// ============================================================
// DETECÇÃO DE RETORNO POR LINK DE RESET (email "esqueci senha")
// O Supabase redireciona de volta com a sessão já ativa
// ============================================================
async function detectarReset() {
  // Supabase passa o token no hash da URL após convite ou reset
  const hash = window.location.hash;
  const temToken = hash.includes("access_token");

  if (!temToken) return false;

  // Aguarda o Supabase processar o token do hash automaticamente
  await new Promise(resolve => setTimeout(resolve, 500));

  const { data: { session } } = await db.auth.getSession();

  if (!session) return false;

  const { data: usuario } = await db
    .from("usuarios")
    .select("id, username, papeis(nome)")
    .eq("auth_id", session.user.id)
    .single();

  if (!usuario) {
    // Usuário ainda não foi inserido na tabela usuarios
    mostrarTela("tela-trocar-senha");
    document.getElementById("aviso-primeiro-login").classList.remove("hidden");
    // Guarda só o auth temporariamente
    window.usuarioAtual = {
      id: null,
      authId: session.user.id,
      username: session.user.email,
      email: session.user.email,
      papel: null,
      primeiroLogin: true,
    };
    return true;
  }

  window.usuarioAtual = {
    id:           usuario.id,
    authId:       session.user.id,
    username:     usuario.username,
    email:        session.user.email,
    papel:        usuario.papeis.nome,
    primeiroLogin: true,
  };

  mostrarTela("tela-trocar-senha");
  document.getElementById("aviso-primeiro-login").classList.remove("hidden");
  return true;
}

// ============================================================
// FLUXO: TROCAR SENHA (primeiro login ou após reset)
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

  okEl.textContent = "Senha alterada com sucesso! Redirecionando...";
  setTimeout(() => {
    window.usuarioAtual.primeiroLogin = false;
    entrarNoApp();
  }, 1500);
}

// ============================================================
// FLUXO: ESQUECI MINHA SENHA
// ============================================================
async function doEsqueceuSenha() {
  const email = document.getElementById("inp-email-reset").value.trim();
  const errEl = document.getElementById("reset-err");
  const okEl  = document.getElementById("reset-ok");

  errEl.textContent = "";
  okEl.textContent  = "";

  const resultado = await esqueceuSenha(email);

  if (resultado.erro) {
    errEl.textContent = resultado.erro;
    return;
  }

  okEl.textContent = "Email enviado! Verifique sua caixa de entrada.";
}

// ============================================================
// FLUXO: ALTERAR SENHA (usuário já logado, no perfil)
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
  document.getElementById("inp-perfil-nova").value = "";
  document.getElementById("inp-perfil-confirmar").value = "";
}

// ============================================================
// INICIALIZAÇÃO — checa sessão existente ao carregar a página
// ============================================================
async function inicializar() {
  // Verifica se veio por link de reset
  const foiReset = await detectarReset();
  if (foiReset) return;

  // Verifica sessão ativa (ex: usuário que não saiu)
  const { data: { session } } = await db.auth.getSession();

  if (session) {
    const { data: usuario } = await db
      .from("usuarios")
      .select("id, username, primeiro_login, papeis(nome)")
      .eq("auth_id", session.user.id)
      .single();

    if (usuario) {
      window.usuarioAtual = {
        id:           usuario.id,
        authId:       session.user.id,
        username:     usuario.username,
        email:        session.user.email,
        papel:        usuario.papeis.nome,
        primeiroLogin: usuario.primeiro_login,
      };

      if (usuario.primeiro_login) {
        mostrarTela("tela-trocar-senha");
      } else {
        entrarNoApp();
      }
      return;
    }
  }

  mostrarTela("tela-login");
}
