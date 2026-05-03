// app.js

const RECURSOS = ["funcionarios", "relatorios", "financeiro", "estoque", "config"];
const ACOES    = ["criar", "ler", "editar", "deletar"];

const LABEL_RECURSO = {
  funcionarios: "👥 Funcionários",
  relatorios:   "📄 Relatórios",
  financeiro:   "💰 Financeiro",
  estoque:      "📦 Estoque",
  config:       "⚙️ Config",
};

// ============================================================
// ENTRAR NO APP
// ============================================================
async function entrarNoApp() {
  mostrarTela("tela-app");
  document.getElementById("lbl-user").textContent  = window.usuarioAtual.username;
  document.getElementById("lbl-papel").textContent = window.usuarioAtual.papel;
  filtrarMenuNavegacao();
  irPara("bemvindo");
}

// ============================================================
// TELA DE BOAS-VINDAS
// ============================================================
function carregarBemVindo() {
  const { username, papel } = window.usuarioAtual;

  document.getElementById("bv-nome").textContent  = "Olá, " + username + "!";
  document.getElementById("bv-cargo").textContent = papel || "Sem cargo definido";

  const container = document.getElementById("bv-modulos");
  container.innerHTML = "";

  // Mostra botão apenas dos módulos que o usuário tem acesso
  const disponiveis = RECURSOS.filter(r => ACOES.some(a => pode(r, a)));

  if (!disponiveis.length) {
    container.innerHTML = "<p class='err'>Nenhum módulo disponível. Contate o administrador.</p>";
    return;
  }

  disponiveis.forEach(recurso => {
    const btn = document.createElement("button");
    btn.textContent = LABEL_RECURSO[recurso] || recurso;
    btn.onclick = () => irPara(recurso);
    container.appendChild(btn);
  });
}

// ============================================================
// FILTRA MENU DE NAVEGAÇÃO
// ============================================================
function filtrarMenuNavegacao() {
  RECURSOS.forEach(recurso => {
    const temAlguma = ACOES.some(acao => pode(recurso, acao));
    document.getElementById("nav-" + recurso)?.classList.toggle("hidden", !temAlguma);
  });
}

// ============================================================
// CONTROLE DE TELAS
// ============================================================
function mostrarTela(idTela) {
  ["tela-login", "tela-trocar-senha", "tela-app"].forEach(id => {
    document.getElementById(id)?.classList.add("hidden");
  });
  document.getElementById(idTela)?.classList.remove("hidden");
}

// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================
function irPara(recurso) {
  // Bloqueia acesso direto sem permissão
  if (RECURSOS.includes(recurso) && !ACOES.some(a => pode(recurso, a))) {
    alert("Acesso negado.");
    return;
  }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + recurso)?.classList.add("active");

  const carregadores = {
    "bemvindo":     carregarBemVindo,
    "funcionarios": carregarPaginaRecurso,
    "relatorios":   carregarPaginaRecurso,
    "financeiro":   carregarPaginaRecurso,
    "estoque":      carregarPaginaRecurso,
    "config":       carregarPaginaRecurso,
  };

  if (carregadores[recurso] && recurso !== "perfil") {
    carregadores[recurso](recurso);
  }
}

// ============================================================
// PÁGINA DE RECURSO
// ============================================================
function carregarPaginaRecurso(recurso) {
  const container = document.getElementById("acoes-" + recurso);
  if (!container) return;

  const permitidas = ACOES
    .filter(acao => pode(recurso, acao))
    .map(acao => ({ acao, origem: origemPermissao(recurso, acao) }));

  if (!permitidas.length) {
    container.innerHTML = "<p class='err'>Você não tem acesso a este recurso.</p>";
    return;
  }

  container.innerHTML = "";
  permitidas.forEach(({ acao, origem }) => {
    const btn = document.createElement("button");
    btn.textContent = acao.charAt(0).toUpperCase() + acao.slice(1);
    btn.title       = "Via: " + origem;
    btn.onclick     = () => alert("Ação: " + acao + "\nRecurso: " + recurso + "\nOrigem: " + origem);
    container.appendChild(btn);
  });
}
