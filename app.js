// app.js

// ============================================================
// MAPA DE MÓDULOS → funções mínimas para exibir no menu
// ============================================================
const MODULOS = [
  { key: "funcionarios",  label: "👥 Funcionários",   guard: "ver_funcionarios"     },
  { key: "documentos",    label: "📁 Documentos",      guard: "ver_documentos"       },
  { key: "relatorios",    label: "📄 Relatórios",      guard: "ver_relatorios"       },
  { key: "financeiro",    label: "💰 Financeiro",      guard: "ver_financeiro"       },
  { key: "estoque",       label: "📦 Estoque",         guard: "ver_estoque"          },
  { key: "monitoramento", label: "📷 Monitoramento",   guard: "ver_cameras"          },
  { key: "sistema",       label: "⚙️ Sistema",         guard: "ver_logs"             },
];

// ============================================================
// PERMISSÕES POR CARGO (pré-sets para o formulário de criação)
// ============================================================
const CARGOS_PRESETS = {
  "Coordenadora": {
    desc: "Supervisiona equipes, aprova processos e acompanha indicadores.",
    funcoes: [
      "ver_funcionarios","cadastrar_funcionario","editar_funcionario","ver_escala","editar_escala",
      "ver_documentos","upload_documento","alterar_documento","assinar_documento",
      "ver_relatorios","gerar_relatorio","exportar_relatorio",
      "ver_financeiro","aprovar_despesa",
      "ver_cameras","ver_historico_acesso",
    ]
  },
  "Gerente": {
    desc: "Gestão completa da operação. Acesso total ao sistema.",
    funcoes: [
      "ver_funcionarios","cadastrar_funcionario","editar_funcionario","desligar_funcionario","ver_escala","editar_escala",
      "ver_documentos","upload_documento","alterar_documento","excluir_documento","assinar_documento",
      "ver_relatorios","gerar_relatorio","exportar_relatorio",
      "ver_financeiro","aprovar_despesa","realizar_pagamento","ver_folha_pagamento","fechar_caixa",
      "ver_estoque","entrada_mercadoria","saida_mercadoria","ajustar_estoque","solicitar_reposicao","inventario",
      "acesso_redes","ver_logs","config_sistema","criar_usuario","editar_permissoes",
      "ver_cameras","monitorar_ao_vivo","ver_historico_acesso","ver_localizacao","exportar_monitoramento",
    ]
  },
  "Analista de Estoque": {
    desc: "Controla entradas, saídas e inventário. Emite relatórios de movimentação.",
    funcoes: [
      "ver_documentos","upload_documento",
      "ver_relatorios","gerar_relatorio","exportar_relatorio",
      "ver_estoque","entrada_mercadoria","saida_mercadoria","ajustar_estoque","solicitar_reposicao","inventario",
    ]
  },
  "Analista de RH": {
    desc: "Gerencia admissões, demissões, documentação e folha de pagamento.",
    funcoes: [
      "ver_funcionarios","cadastrar_funcionario","editar_funcionario","desligar_funcionario","ver_escala","editar_escala",
      "ver_documentos","upload_documento","alterar_documento",
      "ver_relatorios","gerar_relatorio","exportar_relatorio",
      "ver_folha_pagamento",
    ]
  },
  "Analista de TI": {
    desc: "Mantém infraestrutura, configura o sistema e monitora logs e acessos.",
    funcoes: [
      "ver_funcionarios",
      "ver_relatorios",
      "acesso_redes","ver_logs","config_sistema","criar_usuario","editar_permissoes",
      "ver_cameras","monitorar_ao_vivo","ver_historico_acesso","ver_localizacao","exportar_monitoramento",
    ]
  },
};

// ============================================================
// TODAS AS FUNÇÕES AGRUPADAS (para o formulário de criação)
// ============================================================
const FUNCOES_GRUPOS = {
  "Equipe & RH": [
    { key: "ver_funcionarios",      label: "Ver funcionários"            },
    { key: "cadastrar_funcionario", label: "Cadastrar funcionário"       },
    { key: "editar_funcionario",    label: "Editar dados de funcionário" },
    { key: "desligar_funcionario",  label: "Desligar funcionário"        },
    { key: "ver_escala",            label: "Ver escala de trabalho"      },
    { key: "editar_escala",         label: "Editar escala de trabalho"   },
  ],
  "Documentos": [
    { key: "ver_documentos",        label: "Ver documentos"              },
    { key: "upload_documento",      label: "Enviar documentos"           },
    { key: "alterar_documento",     label: "Alterar documentos"          },
    { key: "excluir_documento",     label: "Excluir documentos"          },
    { key: "assinar_documento",     label: "Assinar documentos"          },
  ],
  "Relatórios": [
    { key: "ver_relatorios",        label: "Ver relatórios"              },
    { key: "gerar_relatorio",       label: "Gerar relatórios"            },
    { key: "exportar_relatorio",    label: "Exportar relatórios"         },
  ],
  "Financeiro": [
    { key: "ver_financeiro",        label: "Ver resumo financeiro"       },
    { key: "aprovar_despesa",       label: "Aprovar despesas"            },
    { key: "realizar_pagamento",    label: "Realizar pagamentos"         },
    { key: "ver_folha_pagamento",   label: "Ver folha de pagamento"      },
    { key: "fechar_caixa",          label: "Fechar caixa"                },
  ],
  "Estoque": [
    { key: "ver_estoque",           label: "Ver estoque"                 },
    { key: "entrada_mercadoria",    label: "Registrar entrada"           },
    { key: "saida_mercadoria",      label: "Registrar saída"             },
    { key: "ajustar_estoque",       label: "Ajustar saldo"               },
    { key: "solicitar_reposicao",   label: "Solicitar reposição"         },
    { key: "inventario",            label: "Realizar inventário"         },
  ],
  "Monitoramento": [
    { key: "ver_cameras",           label: "Ver câmeras"                 },
    { key: "monitorar_ao_vivo",     label: "Monitorar ao vivo"           },
    { key: "ver_historico_acesso",  label: "Ver histórico de acesso"     },
    { key: "ver_localizacao",       label: "Ver localização de equipe"   },
    { key: "exportar_monitoramento",label: "Exportar registros"          },
  ],
  "Sistema": [
    { key: "acesso_redes",          label: "Acesso às redes sociais"     },
    { key: "ver_logs",              label: "Ver logs do sistema"         },
    { key: "config_sistema",        label: "Configurar sistema"          },
    { key: "criar_usuario",         label: "Criar usuários"              },
    { key: "editar_permissoes",     label: "Editar permissões"           },
  ],
};

// ============================================================
// ENTRAR NO APP
// ============================================================
async function entrarNoApp() {
  mostrarTela("tela-app");
  document.getElementById("lbl-user").textContent  = window.usuarioAtual.username;
  document.getElementById("lbl-papel").textContent = window.usuarioAtual.cargo;
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

  const fn = {
    bemvindo:      carregarBemVindo,
    funcionarios:  carregarFuncionarios,
    documentos:    carregarDocumentos,
    relatorios:    carregarRelatorios,
    financeiro:    carregarFinanceiro,
    estoque:       carregarEstoque,
    monitoramento: carregarMonitoramento,
    sistema:       carregarSistema,
  }[pagina];

  fn?.();
}

// ============================================================
// BEM-VINDO
// ============================================================
function carregarBemVindo() {
  document.getElementById("bv-nome").textContent  = "Olá, " + window.usuarioAtual.username + "!";
  document.getElementById("bv-cargo").textContent = window.usuarioAtual.cargo;

  const container = document.getElementById("bv-modulos");
  container.innerHTML = "";
  const disponiveis = MODULOS.filter(m => pode(m.guard));

  if (!disponiveis.length) {
    container.innerHTML = "<p class='err'>Nenhum módulo disponível. Contate o administrador.</p>";
    return;
  }
  disponiveis.forEach(({ key, label }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = () => irPara(key);
    container.appendChild(btn);
  });
}

// ============================================================
// FUNCIONÁRIOS
// ============================================================
function carregarFuncionarios() {
  const el = document.getElementById("conteudo-funcionarios");
  let html = "";
  if (pode("cadastrar_funcionario")) html += `<button onclick="alert('Formulário de novo funcionário')">+ Novo funcionário</button>`;
  if (pode("ver_escala"))            html += `<button onclick="alert('Escala de trabalho')">Ver escala</button>`;
  html += "<p style='color:#888;margin-top:12px;font-size:0.9em'>Lista de funcionários será exibida aqui.</p>";
  el.innerHTML = html;
}

// ============================================================
// DOCUMENTOS
// ============================================================
function carregarDocumentos() {
  const el = document.getElementById("conteudo-documentos");
  let html = "";
  if (pode("upload_documento"))  html += `<button onclick="alert('Enviar documento')">+ Enviar documento</button>`;
  if (pode("alterar_documento")) html += `<button onclick="alert('Alterar documento')">Alterar</button>`;
  if (pode("assinar_documento")) html += `<button onclick="alert('Assinar documento')">Assinar</button>`;
  if (pode("excluir_documento")) html += `<button onclick="alert('Excluir documento')" style="color:red">Excluir</button>`;
  html += "<p style='color:#888;margin-top:12px;font-size:0.9em'>Documentos serão listados aqui.</p>";
  el.innerHTML = html;
}

// ============================================================
// RELATÓRIOS
// ============================================================
function carregarRelatorios() {
  const el = document.getElementById("conteudo-relatorios");
  let html = "";
  if (pode("gerar_relatorio"))    html += `<button onclick="alert('Gerar relatório')">+ Gerar relatório</button>`;
  if (pode("exportar_relatorio")) html += `<button onclick="alert('Exportar')">Exportar</button>`;
  html += "<p style='color:#888;margin-top:12px;font-size:0.9em'>Relatórios serão listados aqui.</p>";
  el.innerHTML = html;
}

// ============================================================
// FINANCEIRO
// ============================================================
function carregarFinanceiro() {
  const el = document.getElementById("conteudo-financeiro");
  let html = "";
  if (pode("realizar_pagamento"))  html += `<button onclick="alert('Realizar pagamento')">💳 Realizar pagamento</button>`;
  if (pode("aprovar_despesa"))     html += `<button onclick="alert('Aprovar despesa')">✔ Aprovar despesa</button>`;
  if (pode("ver_folha_pagamento")) html += `<button onclick="alert('Folha de pagamento')">📋 Folha de pagamento</button>`;
  if (pode("fechar_caixa"))        html += `<button onclick="alert('Fechar caixa')">🔒 Fechar caixa</button>`;
  html += "<p style='color:#888;margin-top:12px;font-size:0.9em'>Resumo financeiro será exibido aqui.</p>";
  el.innerHTML = html;
}

// ============================================================
// ESTOQUE
// ============================================================
function carregarEstoque() {
  const el = document.getElementById("conteudo-estoque");
  let html = "";
  if (pode("entrada_mercadoria"))  html += `<button onclick="alert('Entrada de mercadoria')">+ Entrada</button>`;
  if (pode("saida_mercadoria"))    html += `<button onclick="alert('Saída de mercadoria')">- Saída</button>`;
  if (pode("ajustar_estoque"))     html += `<button onclick="alert('Ajustar saldo')">Ajustar saldo</button>`;
  if (pode("solicitar_reposicao")) html += `<button onclick="alert('Solicitar reposição')">Solicitar reposição</button>`;
  if (pode("inventario"))          html += `<button onclick="alert('Inventário')">Inventário</button>`;
  html += "<p style='color:#888;margin-top:12px;font-size:0.9em'>Itens do estoque serão listados aqui.</p>";
  el.innerHTML = html;
}

// ============================================================
// MONITORAMENTO
// ============================================================
function carregarMonitoramento() {
  const el = document.getElementById("conteudo-monitoramento");
  let html = "";
  if (pode("ver_cameras")) {
    html += `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
        ${["Entrada principal","Sala de operações","Estoque","Financeiro","RH","TI"].map(cam => `
          <div style="border:1px solid #ddd;border-radius:6px;padding:10px;text-align:center;font-size:0.85em">
            <div style="background:#111;height:70px;border-radius:4px;margin-bottom:6px;
                        display:flex;align-items:center;justify-content:center;color:#0f0;font-size:0.8em">
              ${pode("monitorar_ao_vivo") ? "● AO VIVO" : "⬛ SEM ACESSO"}
            </div>
            📷 ${cam}
          </div>
        `).join("")}
      </div>`;
  }
  if (pode("ver_historico_acesso"))   html += `<button onclick="alert('Histórico de acessos')">🕓 Histórico de acessos</button>`;
  if (pode("ver_localizacao"))        html += `<button onclick="alert('Localização da equipe')">📍 Localização da equipe</button>`;
  if (pode("exportar_monitoramento")) html += `<button onclick="alert('Exportar registros')">⬇ Exportar registros</button>`;
  el.innerHTML = html;
}

// ============================================================
// SISTEMA
// ============================================================
function carregarSistema() {
  const el = document.getElementById("conteudo-sistema");
  let html = "";

  if (pode("criar_usuario")) {
    html += `<button onclick="abrirFormUsuario()">+ Novo usuário</button>`;
  }
  if (pode("ver_logs")) {
    html += `<button onclick="alert('Logs do sistema')">📋 Ver logs</button>`;
  }
  if (pode("config_sistema")) {
    html += `<button onclick="alert('Configurações')">⚙️ Configurações</button>`;
  }
  if (pode("acesso_redes")) {
    html += `<button onclick="alert('Redes sociais')">🌐 Redes sociais</button>`;
  }

  // Lista de usuários
  if (pode("criar_usuario") || pode("editar_permissoes")) {
    html += `<div id="lista-usuarios" style="margin-top:16px"></div>`;
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
// FORMULÁRIO DE CRIAR / EDITAR USUÁRIO
// ============================================================
function abrirFormUsuario() {
  document.getElementById("form-usuario-titulo").textContent = "Novo usuário";
  document.getElementById("form-usuario-id").value    = "";
  document.getElementById("fu-username").value        = "";
  document.getElementById("fu-senha").value           = "";
  document.getElementById("fu-cargo").value           = "";
  document.getElementById("fu-cargo-desc").classList.add("hidden");
  document.getElementById("fu-cargo-desc").textContent = "";
  document.getElementById("fu-err").textContent       = "";
  document.getElementById("fu-ok").textContent        = "";
  renderFormPermissoes({});
  document.getElementById("form-usuario").classList.remove("hidden");
  document.getElementById("form-usuario").scrollIntoView({ behavior: "smooth" });
}

async function editarUsuario(id) {
  document.getElementById("form-usuario-titulo").textContent = "Editar usuário";
  document.getElementById("form-usuario-id").value = id;
  document.getElementById("fu-err").textContent = "";
  document.getElementById("fu-ok").textContent  = "";

  const { data: u } = await db.from("usuarios").select("username,cargo").eq("id", id).single();
  const { data: perms } = await db.from("permissoes_usuario").select("funcao").eq("usuario_id", id).eq("permitido", true);

  document.getElementById("fu-username").value = u.username;
  document.getElementById("fu-cargo").value    = u.cargo || "";
  document.getElementById("fu-senha").value    = "";

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
  const id       = document.getElementById("form-usuario-id").value;
  const username = document.getElementById("fu-username").value.trim();
  const senha    = document.getElementById("fu-senha").value.trim();
  const cargo    = document.getElementById("fu-cargo").value;
  const errEl    = document.getElementById("fu-err");
  const okEl     = document.getElementById("fu-ok");
  errEl.textContent = ""; okEl.textContent = "";

  if (!username) { errEl.textContent = "Informe o nome de usuário."; return; }
  if (!cargo)    { errEl.textContent = "Selecione um cargo."; return; }
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

  setTimeout(() => { fecharFormUsuario(); carregarListaUsuarios(); }, 1200);
}

// ============================================================
// ATIVAR / DESATIVAR USUÁRIO
// ============================================================
async function toggleAtivo(id, ativoAtual) {
  const acao = ativoAtual ? "desativar" : "ativar";
  if (!confirm(`Deseja ${acao} este usuário?`)) return;
  await db.from("usuarios").update({ ativo: !ativoAtual }).eq("id", id);
  carregarListaUsuarios();
}
