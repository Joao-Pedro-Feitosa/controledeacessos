// app.js — navegação, controle de acesso híbrido, renderização

const RECURSOS = ["funcionarios", "relatorios", "financeiro", "config"];
const ACOES    = ["criar", "ler", "editar", "deletar"];

// ============================================================
// ENTRAR NO APP
// ============================================================
async function entrarNoApp() {
  mostrarTela("tela-app");
  document.getElementById("lbl-user").textContent  = window.usuarioAtual.username;
  document.getElementById("lbl-papel").textContent = window.usuarioAtual.papel;
  await filtrarMenuNavegacao();
  irPara("minhas-permissoes");
}

// ============================================================
// FILTRA MENU — oculta botões de recursos sem nenhuma permissão
// ============================================================
async function filtrarMenuNavegacao() {
  for (const recurso of RECURSOS) {
    // Checa se tem ao menos UMA ação permitida neste recurso
    let temAlguma = false;
    for (const acao of ACOES) {
      const { permitido } = await checarPermissao(window.usuarioAtual.id, recurso, acao);
      if (permitido) { temAlguma = true; break; }
    }

    // Oculta o botão do menu se não tiver nenhuma permissão
    const btn = document.getElementById("nav-" + recurso);
    if (btn) btn.classList.toggle("hidden", !temAlguma);
  }
}

// ============================================================
// CONTROLE DE TELAS
// ============================================================
function mostrarTela(idTela) {
  ["tela-login", "tela-trocar-senha", "tela-app"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  const alvo = document.getElementById(idTela);
  if (alvo) alvo.classList.remove("hidden");
}

// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================
function irPara(recurso) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const pagina = document.getElementById("page-" + recurso);
  if (pagina) pagina.classList.add("active");

  if (recurso === "minhas-permissoes") {
    carregarMinhasPermissoes();
  } else if (recurso !== "perfil") {
    carregarPaginaRecurso(recurso);
  }
}

// ============================================================
// VERIFICAÇÃO HÍBRIDA: ACL → RBAC
// ============================================================
async function checarPermissao(usuarioId, recursoNome, acao) {
  const { data: rec } = await db
    .from("recursos")
    .select("id")
    .eq("nome", recursoNome)
    .single();

  if (!rec) return { permitido: false, origem: "recurso não encontrado" };

  // 1. Verifica ACL individual
  const { data: acl } = await db
    .from("acl_permissoes")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("recurso_id", rec.id)
    .eq("acao", acao)
    .maybeSingle();

  if (acl) return { permitido: true, origem: "ACL (permissão individual)" };

  // 2. Verifica RBAC do papel
  const { data: usuario } = await db
    .from("usuarios")
    .select("papel_id")
    .eq("id", usuarioId)
    .single();

  const { data: rbac } = await db
    .from("rbac_permissoes")
    .select("id")
    .eq("papel_id", usuario.papel_id)
    .eq("recurso_id", rec.id)
    .eq("acao", acao)
    .maybeSingle();

  if (rbac) return { permitido: true, origem: "RBAC (papel: " + window.usuarioAtual.papel + ")" };

  return { permitido: false, origem: "Negado" };
}

// ============================================================
// PÁGINA DE RECURSO — só renderiza ações permitidas (oculta o resto)
// ============================================================
async function carregarPaginaRecurso(recurso) {
  const container = document.getElementById("acoes-" + recurso);
  if (!container) return;
  container.innerHTML = "Verificando permissões...";

  const permitidas = [];
  for (const acao of ACOES) {
    const { permitido, origem } = await checarPermissao(window.usuarioAtual.id, recurso, acao);
    if (permitido) permitidas.push({ acao, origem });
  }

  container.innerHTML = "";

  if (permitidas.length === 0) {
    container.innerHTML = "<p class='err'>Você não tem acesso a este recurso.</p>";
    return;
  }

  permitidas.forEach(({ acao, origem }) => {
    const btn = document.createElement("button");
    btn.textContent = acao.charAt(0).toUpperCase() + acao.slice(1);
    btn.title       = "Permitido via: " + origem;
    btn.onclick     = () => alert("Ação: " + acao + "\nRecurso: " + recurso + "\nOrigem: " + origem);
    container.appendChild(btn);
  });
}

// ============================================================
// PÁGINA: MINHAS PERMISSÕES
// ============================================================
async function carregarMinhasPermissoes() {
  const tbody = document.getElementById("tabela-permissoes");
  tbody.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

  const linhas = [];
  for (const recurso of RECURSOS) {
    for (const acao of ACOES) {
      const { permitido, origem } = await checarPermissao(window.usuarioAtual.id, recurso, acao);
      linhas.push({ recurso, acao, permitido, origem });
    }
  }

  tbody.innerHTML = "";
  linhas.forEach(({ recurso, acao, permitido, origem }) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + recurso + "</td>" +
      "<td>" + acao + "</td>" +
      "<td>" + origem + "</td>" +
      "<td class='" + (permitido ? "ok" : "err") + "'>" + (permitido ? "✔ Sim" : "✘ Não") + "</td>";
    tbody.appendChild(tr);
  });
}
