// app.js

// ============================================================
// MAPA DE MÓDULOS → funções mínimas para exibir no menu
// ============================================================
const MODULOS = [
  { key: "funcionarios", label: "👥 Usuários / Funcionários", guard: "criar_usuario" },
  { key: "documentos", label: "📁 Documentos", guard: "ver_documentos" },
  { key: "relatorios", label: "📄 Relatórios", guard: "ver_relatorios" },
  { key: "financeiro", label: "💰 Financeiro", guard: "ver_financeiro" },
  { key: "estoque", label: "📦 Estoque", guard: "ver_estoque" },
  { key: "monitoramento", label: "📷 Monitoramento", guard: "ver_cameras" },
  { key: "sistema", label: "⚙️ Sistema", guard: "ver_logs" },
  { key: "cargos", label: "🏢 Cargos", guard: "gerenciar_cargos" },
];



// ============================================================
// PERMISSÕES POR CARGO (pré-sets para o formulário de criação)
// ============================================================
const CARGOS_PRESETS = {
  "Coordenadora": {
    desc: "Supervisiona equipes, aprova processos e acompanha indicadores.",
    funcoes: [
      "criar_usuario", "editar_permissoes", "ver_escala", "editar_escala",
      "ver_documentos", "upload_documento", "alterar_documento", "assinar_documento",
      "ver_relatorios", "gerar_relatorio", "exportar_relatorio",
      "ver_financeiro", "aprovar_despesa",
      "ver_cameras", "ver_historico_acesso",
    ]
  },
  "Gerente": {
    desc: "Gestão completa da operação. Acesso total ao sistema.",
    funcoes: [
      "ver_escala", "editar_escala",
      "ver_documentos", "upload_documento", "alterar_documento", "excluir_documento", "assinar_documento",
      "ver_relatorios", "gerar_relatorio", "exportar_relatorio",
      "ver_financeiro", "aprovar_despesa", "realizar_pagamento", "ver_folha_pagamento", "fechar_caixa",
      "ver_estoque", "entrada_mercadoria", "saida_mercadoria", "ajustar_estoque", "solicitar_reposicao", "inventario",
      "acesso_redes", "ver_logs", "config_sistema", "criar_usuario", "editar_permissoes", "gerenciar_cargos",
      "ver_cameras", "monitorar_ao_vivo", "ver_historico_acesso", "ver_localizacao", "exportar_monitoramento",
    ]
  },
  "Analista de Estoque": {
    desc: "Controla entradas, saídas e inventário. Emite relatórios de movimentação.",
    funcoes: [
      "ver_documentos", "upload_documento",
      "ver_relatorios", "gerar_relatorio", "exportar_relatorio",
      "ver_estoque", "entrada_mercadoria", "saida_mercadoria", "ajustar_estoque", "solicitar_reposicao", "inventario",
    ]
  },
  "Analista de RH": {
    desc: "Gerencia admissões, demissões, documentação e folha de pagamento.",
    funcoes: [
      "criar_usuario", "editar_permissoes", "ver_escala", "editar_escala",
      "ver_documentos", "upload_documento", "alterar_documento",
      "ver_relatorios", "gerar_relatorio", "exportar_relatorio",
      "ver_folha_pagamento",
    ]
  },
  "Analista de TI": {
    desc: "Mantém infraestrutura, configura o sistema e monitora logs e acessos.",
    funcoes: [

      "ver_relatorios",
      "acesso_redes", "ver_logs", "config_sistema", "criar_usuario", "editar_permissoes",
      "ver_cameras", "monitorar_ao_vivo", "ver_historico_acesso", "ver_localizacao", "exportar_monitoramento",
    ]
  },
};

// ============================================================
// TODAS AS FUNÇÕES AGRUPADAS (para o formulário de criação)
// ============================================================
const FUNCOES_GRUPOS = {
  "Equipe & RH": [
    { key: "ver_escala", label: "Ver escala de trabalho" },
    { key: "editar_escala", label: "Editar escala de trabalho" },
  ],
  "Documentos": [
    { key: "ver_documentos", label: "Ver documentos" },
    { key: "upload_documento", label: "Enviar documentos" },
    { key: "alterar_documento", label: "Alterar documentos" },
    { key: "excluir_documento", label: "Excluir documentos" },
    { key: "assinar_documento", label: "Assinar documentos" },
  ],
  "Relatórios": [
    { key: "ver_relatorios", label: "Ver relatórios" },
    { key: "gerar_relatorio", label: "Gerar relatórios" },
    { key: "exportar_relatorio", label: "Exportar relatórios" },
  ],
  "Financeiro": [
    { key: "ver_financeiro", label: "Ver resumo financeiro" },
    { key: "aprovar_despesa", label: "Aprovar despesas" },
    { key: "realizar_pagamento", label: "Realizar pagamentos" },
    { key: "ver_folha_pagamento", label: "Ver folha de pagamento" },
    { key: "fechar_caixa", label: "Fechar caixa" },
  ],
  "Estoque": [
    { key: "ver_estoque", label: "Ver estoque" },
    { key: "entrada_mercadoria", label: "Registrar entrada" },
    { key: "saida_mercadoria", label: "Registrar saída" },
    { key: "ajustar_estoque", label: "Ajustar saldo" },
    { key: "solicitar_reposicao", label: "Solicitar reposição" },
    { key: "inventario", label: "Realizar inventário" },
  ],
  "Monitoramento": [
    { key: "ver_cameras", label: "Ver câmeras" },
    { key: "monitorar_ao_vivo", label: "Monitorar ao vivo" },
    { key: "ver_historico_acesso", label: "Ver histórico de acesso" },
    { key: "ver_localizacao", label: "Ver localização de equipe" },
    { key: "exportar_monitoramento", label: "Exportar registros" },
  ],
  "Sistema": [
    { key: "acesso_redes", label: "Acesso às redes sociais" },
    { key: "ver_logs", label: "Ver logs do sistema" },
    { key: "config_sistema", label: "Configurar sistema" },
    { key: "criar_usuario", label: "Criar usuários" },
    { key: "editar_permissoes", label: "Editar permissões" },
    { key: "gerenciar_cargos", label: "Gerenciar cargos" },
  ],
};

// ============================================================
// ENTRAR NO APP
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('active');
}

async function entrarNoApp() {
  mostrarTela("tela-app");
  const uname = window.usuarioAtual.username;
  document.getElementById("lbl-user").textContent = uname;
  document.getElementById("lbl-papel").textContent = window.usuarioAtual.cargo;
  const avatar = document.getElementById("topbar-avatar");
  if (avatar) avatar.textContent = uname.charAt(0).toUpperCase();
  filtrarMenuNavegacao();
  irPara("bemvindo");
}

// ============================================================
// MENU
// ============================================================
function filtrarMenuNavegacao() {
  MODULOS.forEach(({ key, guard }) => {
    document.getElementById("nav-" + key)?.classList.toggle("hidden", !pode(guard));
  });
}

// ============================================================
// NAVEGAÇÃO
// ============================================================
function irPara(pagina) {
  const modulo = MODULOS.find(m => m.key === pagina);
  if (modulo && !pode(modulo.guard)) { alert("Acesso negado."); return; }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + pagina)?.classList.add("active");

  document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
  const navBtn = document.getElementById("nav-" + pagina);
  if (navBtn) navBtn.classList.add("active");

  // Close mobile sidebar
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');

  const fn = {
    bemvindo: carregarBemVindo,
    funcionarios: carregarFuncionarios,
    documentos: carregarDocumentos,
    relatorios: carregarRelatorios,
    financeiro: carregarFinanceiro,
    estoque: carregarEstoque,
    monitoramento: carregarMonitoramento,
    sistema: carregarSistema,
    cargos: carregarCargos,
  }[pagina];

  fn?.();
}

// ============================================================
// BEM-VINDO
// ============================================================
async function carregarBemVindo() {
  document.getElementById("bv-nome").textContent = "Olá, " + window.usuarioAtual.username + "!";
  document.getElementById("bv-cargo").textContent = window.usuarioAtual.cargo;

  // --- Fetch stats from Supabase ---
  try {
    const [resTotal, resInativos, resPerms] = await Promise.all([
      db.from("usuarios").select("id", { count: "exact", head: true }),
      db.from("usuarios").select("id", { count: "exact", head: true }).eq("ativo", false),
      db.from("permissoes_usuario").select("id", { count: "exact", head: true }).eq("permitido", true),
    ]);
    document.getElementById("stat-funcionarios").textContent = (resTotal.count || 0) - (resInativos.count || 0);
    document.getElementById("stat-usuarios-total").textContent = resTotal.count ?? "—";
    document.getElementById("stat-inativos").textContent = resInativos.count ?? "0";
    document.getElementById("stat-permissoes").textContent = resPerms.count ?? "—";
  } catch (e) {
    console.warn("Erro ao carregar estatísticas:", e);
  }


}

// ============================================================
// FUNCIONÁRIOS
// ============================================================
async function carregarFuncionarios() {
  const acoes = document.getElementById("acoes-funcionarios");
  let ab = "";
  if (pode("criar_usuario")) ab += `<button class="btn-primary" onclick="abrirFormUsuario()">+ Novo usuário/funcionário</button>`;
  if (pode("ver_escala")) ab += `<button onclick="alert('Escala de trabalho')">📅 Ver escala</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-funcionarios");
  el.innerHTML = "Carregando...";

  const { data, error } = await db
    .from("usuarios")
    .select("id, username, cargo, ativo")
    .order("username");

  if (error || !data) { el.innerHTML = "<p class='err'>Erro ao carregar usuários.</p>"; return; }

  el.innerHTML = `<table>
    <thead><tr><th>Nome / Usuário</th><th>Cargo</th><th>Status</th><th>Ações</th></tr></thead>
    <tbody>
      ${data.map(u => `
        <tr>
          <td>${u.username}</td>
          <td>${u.cargo || "Sem cargo"}</td>
          <td><span class="badge ${u.ativo ? 'badge-ativo' : 'badge-inativo'}">${u.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td>
            ${pode("editar_permissoes") ? `<button class="btn-sm" onclick="editarUsuario(${u.id})" style="margin-right:6px">✏️ Editar</button>` : ""}
            ${pode("editar_permissoes") ? `<button class="btn-sm" onclick="toggleAtivo(${u.id},${u.ativo})">${u.ativo ? "Desativar" : "Ativar"}</button>` : ""}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
}

// ============================================================
// DOCUMENTOS
// ============================================================
function carregarDocumentos() {
  const acoes = document.getElementById("acoes-documentos");
  let ab = "";
  if (pode("upload_documento")) ab += `<button class="btn-primary" onclick="alert('Enviar documento')">+ Enviar documento</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-documentos");
  const docs = [
    { nome: "Contrato_2025.pdf", tipo: "Contrato", data: "02/05/2026", autor: "Maria Silva" },
    { nome: "Relatorio_Mensal.xlsx", tipo: "Relatório", data: "01/05/2026", autor: "João Santos" },
    { nome: "Politica_Seguranca.docx", tipo: "Política", data: "28/04/2026", autor: "Carlos Lima" },
    { nome: "Ata_Reuniao_04.pdf", tipo: "Ata", data: "25/04/2026", autor: "Ana Oliveira" },
  ];
  let h = `<table><thead><tr><th>Documento</th><th>Tipo</th><th>Data</th><th>Autor</th><th>Ações</th></tr></thead><tbody>`;
  docs.forEach(d => {
    let acts = '';
    if (pode("alterar_documento")) acts += `<button class="btn-sm" onclick="alert('Editar')">✏️</button> `;
    if (pode("assinar_documento")) acts += `<button class="btn-sm" onclick="alert('Assinar')">✍️</button> `;
    if (pode("excluir_documento")) acts += `<button class="btn-sm btn-danger" onclick="alert('Excluir')">🗑️</button>`;
    h += `<tr><td>${d.nome}</td><td>${d.tipo}</td><td>${d.data}</td><td>${d.autor}</td><td>${acts || '—'}</td></tr>`;
  });
  el.innerHTML = h + '</tbody></table>';
}

// ============================================================
// RELATÓRIOS
// ============================================================
function carregarRelatorios() {
  const acoes = document.getElementById("acoes-relatorios");
  let ab = "";
  if (pode("gerar_relatorio")) ab += `<button class="btn-primary" onclick="alert('Gerar relatório')">+ Gerar relatório</button>`;
  if (pode("exportar_relatorio")) ab += `<button onclick="alert('Exportar')">⬇ Exportar</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-relatorios");
  const rels = [
    { titulo: "Relatório de Vendas - Abril", tipo: "Vendas", data: "30/04/2026", status: "Concluído" },
    { titulo: "Auditoria de Estoque Q1", tipo: "Estoque", data: "15/04/2026", status: "Concluído" },
    { titulo: "Desempenho da Equipe", tipo: "RH", data: "10/04/2026", status: "Em análise" },
  ];
  el.innerHTML = rels.map(r => `<div class="module-card"><div class="module-card-info"><div class="module-card-title">${r.titulo}</div><div class="module-card-sub">${r.tipo} · ${r.data}</div></div><span class="badge ${r.status === 'Concluído' ? 'badge-ativo' : 'badge-inativo'}">${r.status}</span></div>`).join('');
}

// ============================================================
// FINANCEIRO
// ============================================================
function carregarFinanceiro() {
  const acoes = document.getElementById("acoes-financeiro");
  let ab = "";
  if (pode("realizar_pagamento")) ab += `<button class="btn-primary" onclick="alert('Realizar pagamento')">💳 Pagamento</button>`;
  if (pode("aprovar_despesa")) ab += `<button onclick="alert('Aprovar despesa')">✔ Aprovar despesa</button>`;
  if (pode("ver_folha_pagamento")) ab += `<button onclick="alert('Folha')">📋 Folha</button>`;
  if (pode("fechar_caixa")) ab += `<button onclick="alert('Fechar caixa')">🔒 Fechar caixa</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-financeiro");
  el.innerHTML = `<div class="dashboard-stats" style="margin-bottom:20px"><div class="stat-card glass"><div class="stat-icon" style="background:rgba(52,211,153,0.12);color:#34d399">💰</div><div class="stat-info"><div class="stat-value">R$ 84.500</div><div class="stat-label">Receita mensal</div></div></div><div class="stat-card glass"><div class="stat-icon" style="background:rgba(248,113,113,0.12);color:#f87171">📉</div><div class="stat-info"><div class="stat-value">R$ 32.100</div><div class="stat-label">Despesas</div></div></div><div class="stat-card glass"><div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#a78bfa">📊</div><div class="stat-info"><div class="stat-value">R$ 52.400</div><div class="stat-label">Saldo</div></div></div></div><table><thead><tr><th>Descrição</th><th>Valor</th><th>Data</th><th>Status</th></tr></thead><tbody><tr><td>Folha de pagamento</td><td>R$ 28.000</td><td>05/05/2026</td><td><span class="badge badge-ativo">Pago</span></td></tr><tr><td>Aluguel do escritório</td><td>R$ 4.500</td><td>01/05/2026</td><td><span class="badge badge-ativo">Pago</span></td></tr><tr><td>Fornecedor XYZ</td><td>R$ 12.300</td><td>10/05/2026</td><td><span class="badge badge-inativo">Pendente</span></td></tr></tbody></table>`;
}

// ============================================================
// ESTOQUE
// ============================================================
function carregarEstoque() {
  const acoes = document.getElementById("acoes-estoque");
  let ab = "";
  if (pode("entrada_mercadoria")) ab += `<button class="btn-primary" onclick="alert('Entrada')">+ Entrada</button>`;
  if (pode("saida_mercadoria")) ab += `<button onclick="alert('Saída')">- Saída</button>`;
  if (pode("inventario")) ab += `<button onclick="alert('Inventário')">📋 Inventário</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-estoque");
  const itens = [
    { item: "Papel A4 (resma)", qtd: 120, min: 50, status: "Normal" },
    { item: "Toner impressora", qtd: 8, min: 5, status: "Normal" },
    { item: "Caneta esferográfica", qtd: 45, min: 30, status: "Normal" },
    { item: "Envelope pardo", qtd: 12, min: 20, status: "Baixo" },
    { item: "Pasta suspensa", qtd: 3, min: 15, status: "Crítico" },
  ];
  el.innerHTML = `<table><thead><tr><th>Item</th><th>Quantidade</th><th>Mínimo</th><th>Status</th></tr></thead><tbody>${itens.map(i => `<tr><td>${i.item}</td><td>${i.qtd}</td><td>${i.min}</td><td><span class="badge ${i.status === 'Normal' ? 'badge-ativo' : 'badge-inativo'}">${i.status}</span></td></tr>`).join('')}</tbody></table>`;
}

// ============================================================
// MONITORAMENTO
// ============================================================
function carregarMonitoramento() {
  const el = document.getElementById("conteudo-monitoramento");
  let html = "";
  if (pode("ver_cameras")) {
    html += `
      <div class="cam-grid">
        ${["Entrada principal", "Sala de operações", "Estoque", "Financeiro", "RH", "TI"].map(cam => `
          <div class="cam-card">
            <div class="cam-preview ${pode("monitorar_ao_vivo") ? "" : "no-access"}">
              ${pode("monitorar_ao_vivo") ? "● AO VIVO" : "⬛ SEM ACESSO"}
            </div>
            📷 ${cam}
          </div>
        `).join("")}
      </div>`;
  }
  if (pode("ver_historico_acesso")) html += `<button onclick="alert('Histórico de acessos')">🕓 Histórico de acessos</button>`;
  if (pode("ver_localizacao")) html += `<button onclick="alert('Localização da equipe')">📍 Localização da equipe</button>`;
  if (pode("exportar_monitoramento")) html += `<button onclick="alert('Exportar registros')">⬇ Exportar registros</button>`;
  el.innerHTML = html;
}

// ============================================================
// SISTEMA
// ============================================================
function carregarSistema() {
  const acoes = document.getElementById("acoes-sistema");
  let ab = "";
  if (pode("criar_usuario")) ab += `<button class="btn-primary" onclick="abrirFormUsuario()">+ Novo usuário</button>`;
  if (pode("ver_logs")) ab += `<button onclick="alert('Logs do sistema')">📋 Logs</button>`;
  if (pode("config_sistema")) ab += `<button onclick="alert('Configurações')">⚙️ Config</button>`;
  if (acoes) acoes.innerHTML = ab;

  const el = document.getElementById("conteudo-sistema");
  let html = "";
  if (pode("criar_usuario") || pode("editar_permissoes")) {
    html += `<div id="lista-usuarios" style="margin-top:8px"></div>`;
  }
  el.innerHTML = html;

  if (pode("criar_usuario") || pode("editar_permissoes")) {
    carregarListaUsuarios();
  }
}

// ============================================================
// LISTA DE USUÁRIOS
// ============================================================
async function carregarListaUsuarios() {
  const el = document.getElementById("lista-usuarios");
  if (!el) return;
  el.innerHTML = "Carregando usuários...";

  const { data, error } = await db
    .from("usuarios")
    .select("id, username, cargo, ativo")
    .order("username");

  if (error || !data) { el.innerHTML = "<p class='err'>Erro ao carregar usuários.</p>"; return; }

  el.innerHTML = "<h3 style='margin-bottom:10px'>Usuários cadastrados</h3>" +
    data.map(u => `
      <div class="usuario-card">
        <div class="usuario-card-header">
          <div>
            <span class="usuario-nome">${u.username}</span>
            <span class="badge ${u.ativo ? "badge-ativo" : "badge-inativo"}">
              ${u.ativo ? "ativo" : "inativo"}
            </span>
            <div class="usuario-cargo">${u.cargo || "Sem cargo"}</div>
          </div>
          <div style="display:flex;gap:6px">
            ${pode("editar_permissoes") ? `<button onclick="editarUsuario(${u.id})">Editar</button>` : ""}
            ${pode("editar_permissoes") ? `<button onclick="toggleAtivo(${u.id},${u.ativo})">${u.ativo ? "Desativar" : "Ativar"}</button>` : ""}
          </div>
        </div>
      </div>
    `).join("");
}

// ============================================================
// CARGOS
// ============================================================
function carregarCargos() {
  const el = document.getElementById("conteudo-cargos");
  if (!pode("gerenciar_cargos")) {
    el.innerHTML = "<p class='err'>Acesso negado.</p>";
    return;
  }

  let html = "<h3 style='margin-bottom:10px'>Cargos do Sistema</h3>";

  Object.keys(CARGOS_PRESETS).forEach(nome => {
    const cargo = CARGOS_PRESETS[nome];
    html += `
      <div class="usuario-card">
        <div class="usuario-card-header">
          <div>
            <span class="usuario-nome">${nome}</span>
            <div class="usuario-cargo">${cargo.desc}</div>
            <div style="font-size: 11px; opacity: 0.7; margin-top: 4px;">
              ${cargo.funcoes.length} permissões atribuídas
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="editarCargo('${nome}')">Editar Permissões</button>
          </div>
        </div>
      </div>
    `;
  });

  el.innerHTML = html;
}

function editarCargo(nome) {
  const cargo = CARGOS_PRESETS[nome];
  if (!cargo) return;

  document.getElementById("fc-nome-original").value = nome;
  document.getElementById("fc-nome").value = nome;
  document.getElementById("fc-desc").value = cargo.desc;

  const mapa = {};
  cargo.funcoes.forEach(f => { mapa[f] = true; });
  renderFormPermissoesCargo(mapa);

  document.getElementById("fc-err").textContent = "";
  document.getElementById("fc-ok").textContent = "";
  document.getElementById("form-cargo").classList.remove("hidden");
  document.getElementById("form-cargo").scrollIntoView({ behavior: "smooth" });
}

function renderFormPermissoesCargo(marcadas) {
  const el = document.getElementById("fc-permissoes");
  el.innerHTML = Object.entries(FUNCOES_GRUPOS).map(([grupo, funcoes]) => `
    <div class="perm-grupo">
      <h4>${grupo}</h4>
      ${funcoes.map(f => `
        <label>
          <input type="checkbox" name="perm_cargo" value="${f.key}" ${marcadas[f.key] ? "checked" : ""}>
          ${f.label}
        </label>
      `).join("")}
    </div>
  `).join("");
}

function fecharFormCargo() {
  document.getElementById("form-cargo").classList.add("hidden");
}

function salvarCargo() {
  const nomeOriginal = document.getElementById("fc-nome-original").value;
  const desc = document.getElementById("fc-desc").value;
  const funcoesMarcadas = [...document.querySelectorAll("input[name=perm_cargo]:checked")].map(c => c.value);

  if (CARGOS_PRESETS[nomeOriginal]) {
    CARGOS_PRESETS[nomeOriginal].desc = desc;
    CARGOS_PRESETS[nomeOriginal].funcoes = funcoesMarcadas;

    document.getElementById("fc-ok").textContent = "Cargo atualizado com sucesso!";
    setTimeout(() => {
      fecharFormCargo();
      carregarCargos();
    }, 1200);
  }
}

// ============================================================
// FORMULÁRIO DE CRIAR / EDITAR USUÁRIO
// ============================================================
function abrirFormUsuario() {
  document.getElementById("form-usuario-titulo").textContent = "Novo usuário";
  document.getElementById("form-usuario-id").value = "";
  document.getElementById("fu-username").value = "";
  document.getElementById("fu-senha").value = "";
  document.getElementById("fu-cargo").value = "";
  document.getElementById("fu-cargo-desc").classList.add("hidden");
  document.getElementById("fu-cargo-desc").textContent = "";
  document.getElementById("fu-err").textContent = "";
  document.getElementById("fu-ok").textContent = "";
  renderFormPermissoes({});
  document.getElementById("form-usuario").classList.remove("hidden");
  document.getElementById("form-usuario").scrollIntoView({ behavior: "smooth" });
}

async function editarUsuario(id) {
  document.getElementById("form-usuario-titulo").textContent = "Editar usuário";
  document.getElementById("form-usuario-id").value = id;
  document.getElementById("fu-err").textContent = "";
  document.getElementById("fu-ok").textContent = "";

  const { data: u } = await db.from("usuarios").select("username,cargo").eq("id", id).single();
  const { data: perms } = await db.from("permissoes_usuario").select("funcao").eq("usuario_id", id).eq("permitido", true);

  document.getElementById("fu-username").value = u.username;
  document.getElementById("fu-cargo").value = u.cargo || "";
  document.getElementById("fu-senha").value = "";

  const mapa = {};
  (perms || []).forEach(({ funcao }) => { mapa[funcao] = true; });
  renderFormPermissoes(mapa);

  const desc = document.getElementById("fu-cargo-desc");
  if (u.cargo && CARGOS_PRESETS[u.cargo]) {
    desc.textContent = CARGOS_PRESETS[u.cargo].desc;
    desc.classList.remove("hidden");
  } else {
    desc.classList.add("hidden");
  }

  document.getElementById("form-usuario").classList.remove("hidden");
  document.getElementById("form-usuario").scrollIntoView({ behavior: "smooth" });
}

function fecharFormUsuario() {
  document.getElementById("form-usuario").classList.add("hidden");
}

function aplicarCargo(cargo) {
  const desc = document.getElementById("fu-cargo-desc");
  if (!cargo || !CARGOS_PRESETS[cargo]) {
    desc.classList.add("hidden");
    renderFormPermissoes({});
    document.getElementById("fu-senha").value = "";
    return;
  }
  const preset = CARGOS_PRESETS[cargo];
  desc.textContent = preset.desc;
  desc.classList.remove("hidden");

  const mapa = {};
  preset.funcoes.forEach(f => { mapa[f] = true; });
  renderFormPermissoes(mapa);

  const base = cargo.split(" ")[0].replace(/[^a-zA-Z]/g, "");
  document.getElementById("fu-senha").value =
    base.charAt(0).toUpperCase() + base.slice(1).toLowerCase() + "@2025!";
}

function renderFormPermissoes(marcadas) {
  const el = document.getElementById("fu-permissoes");
  el.innerHTML = Object.entries(FUNCOES_GRUPOS).map(([grupo, funcoes]) => `
    <div class="perm-grupo">
      <h4>${grupo}</h4>
      ${funcoes.map(f => `
        <label>
          <input type="checkbox" name="perm" value="${f.key}" ${marcadas[f.key] ? "checked" : ""}>
          ${f.label}
        </label>
      `).join("")}
    </div>
  `).join("");
}

async function salvarUsuario() {
  const id = document.getElementById("form-usuario-id").value;
  const username = document.getElementById("fu-username").value.trim();
  const senha = document.getElementById("fu-senha").value.trim();
  const cargo = document.getElementById("fu-cargo").value;
  const errEl = document.getElementById("fu-err");
  const okEl = document.getElementById("fu-ok");
  errEl.textContent = ""; okEl.textContent = "";

  if (!username) { errEl.textContent = "Informe o nome de usuário."; return; }
  if (!cargo) { errEl.textContent = "Selecione um cargo."; return; }
  if (!id && !senha) { errEl.textContent = "Informe a senha provisória."; return; }

  const funcoesMarcadas = [...document.querySelectorAll("input[name=perm]:checked")]
    .map(c => c.value);

  if (id) {
    // Editar
    const updates = { cargo };
    if (senha) updates.senha = senha;

    const { error } = await db.from("usuarios").update(updates).eq("id", id);
    if (error) { errEl.textContent = "Erro ao atualizar usuário."; return; }

    await db.from("permissoes_usuario").delete().eq("usuario_id", id);
    if (funcoesMarcadas.length) {
      await db.from("permissoes_usuario").insert(
        funcoesMarcadas.map(f => ({ usuario_id: parseInt(id), funcao: f, permitido: true }))
      );
    }
    okEl.textContent = "Usuário atualizado!";
  } else {
    // Criar
    const { data: novoUser, error } = await db
      .from("usuarios")
      .insert({ username, senha, cargo, ativo: true, primeiro_login: true })
      .select("id")
      .single();

    if (error) {
      errEl.textContent = error.message.includes("unique")
        ? "Esse nome de usuário já existe." : "Erro ao criar usuário.";
      return;
    }

    if (funcoesMarcadas.length) {
      await db.from("permissoes_usuario").insert(
        funcoesMarcadas.map(f => ({ usuario_id: novoUser.id, funcao: f, permitido: true }))
      );
    }
    okEl.textContent = "Usuário criado com sucesso!";
  }

  setTimeout(() => {
    fecharFormUsuario();
    carregarListaUsuarios();
    if (document.getElementById("page-funcionarios")?.classList.contains("active")) {
      carregarFuncionarios();
    }
  }, 1200);
}

// ============================================================
// ATIVAR / DESATIVAR USUÁRIO
// ============================================================
async function toggleAtivo(id, ativoAtual) {
  const acao = ativoAtual ? "desativar" : "ativar";
  if (!confirm(`Deseja ${acao} este usuário?`)) return;
  await db.from("usuarios").update({ ativo: !ativoAtual }).eq("id", id);
  carregarListaUsuarios();
  if (document.getElementById("page-funcionarios")?.classList.contains("active")) {
    carregarFuncionarios();
  }
}
