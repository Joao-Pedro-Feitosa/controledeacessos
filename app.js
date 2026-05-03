// app.js — navegação, controle de acesso, renderização

const RECURSOS = ["funcionarios", "relatorios", "financeiro", "config"];
const ACOES    = ["criar", "ler", "editar", "deletar"];

// ============================================================
// ENTRAR NO APP
// ============================================================
async function entrarNoApp() {
  mostrarTela("tela-app");
  document.getElementById("lbl-user").textContent  = window.usuarioAtual.username;
  document.getElementById("lbl-papel").textContent = window.usuarioAtual.papel;
  filtrarMenuNavegacao();    // síncrono agora — sem await
  irPara("minhas-permissoes");
}

// ============================================================
// FILTRA MENU — usa o mapa em memória, sem queries
// ============================================================
function filtrarMenuNavegacao() {
  RECURSOS.forEach(recurso => {
    const temAlguma = ACOES.some(acao => pode(recurso, acao));
    const btn = document.getElementById("nav-" + recurso);
    if (btn) btn.classList.toggle("hidden", !temAlguma);
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
  // Guarda bloqueada para recursos que exigem permissão
  if (RECURSOS.includes(recurso) && !ACOES.some(a => pode(recurso, a))) {
    alert("Acesso negado.");
    return;
  }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + recurso)?.classList.add("active");

  const carregadores = {
    "minhas-permissoes": carregarMinhasPermissoes,
    "funcionarios":      carregarPaginaRecurso,
    "relatorios":        carregarPaginaRecurso,
    "financeiro":        carregarPaginaRecurso,
    "config":            carregarPaginaRecurso,
  };

  if (carregadores[recurso] && recurso !== "perfil") {
    carregadores[recurso](recurso);
  }
}

// ============================================================
// PÁGINA DE RECURSO — renderiza só as ações permitidas
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
    btn.title       = "Permitido via: " + origem;
    btn.onclick     = () => alert("Ação: " + acao + "\nRecurso: " + recurso + "\nOrigem: " + origem);
    container.appendChild(btn);
  });
}

// ============================================================
// PÁGINA: MINHAS PERMISSÕES
// ============================================================
function carregarMinhasPermissoes() {
  const tbody = document.getElementById("tabela-permissoes");

  const linhas = [];
  RECURSOS.forEach(recurso => {
    ACOES.forEach(acao => {
      const origem   = origemPermissao(recurso, acao);
      const permitido = origem !== "Negado";
      linhas.push({ recurso, acao, permitido, origem });
    });
  });

  tbody.innerHTML = linhas.map(({ recurso, acao, permitido, origem }) => `
    <tr>
      <td>${recurso}</td>
      <td>${acao}</td>
      <td>${origem}</td>
      <td class="${permitido ? "ok" : "err"}">${permitido ? "✔ Sim" : "✘ Não"}</td>
    </tr>
  `).join("");
}
