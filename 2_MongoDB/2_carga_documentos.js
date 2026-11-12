// =====================================================================
// SERENO - 2_carga_documentos.js
// Carga dos MESMOS dados da PARTE 2 do Sereno_Oracle_Completo.sql (gerados da mesma fonte).
// Cada documento guarda oracleId = id da linha no Oracle (prova da correspondencia).
// Datas: horario de Sao Paulo (-03:00), o mesmo do TIMESTAMP do Oracle.
// Rodar depois do 1_estrutura_collections.js. Pode rodar de novo: limpa antes de inserir.
// Senha dos usuarios de teste NAO e migrada (dado sensivel fica so no Oracle).
// =====================================================================
use('sereno');
db = db.getSiblingDB('sereno');

db.usuarios.deleteMany({});
db.locais.deleteMany({});
db.estacoes.deleteMany({});

// ---------- usuarios (5 documentos) ----------
db.usuarios.insertMany([
  { oracleId: 1, nome: "Ana Souza", email: "ana.souza@email.com", papel: "CIDADAO", modoBaixoEstimulo: true, criadoEm: new Date("2026-09-01T10:00:00-03:00") },
  { oracleId: 2, nome: "Bruno Lima", email: "bruno.lima@email.com", papel: "CIDADAO", modoBaixoEstimulo: false, criadoEm: new Date("2026-09-02T14:30:00-03:00") },
  { oracleId: 3, nome: "Carla Mendes", email: "carla.mendes@email.com", papel: "CIDADAO", modoBaixoEstimulo: true, criadoEm: new Date("2026-09-05T09:15:00-03:00") },
  { oracleId: 4, nome: "Diego Rocha", email: "diego.rocha@email.com", papel: "CIDADAO", modoBaixoEstimulo: false, criadoEm: new Date("2026-09-10T19:45:00-03:00") },
  { oracleId: 5, nome: "Gestao Sereno", email: "gestor@sereno.app", papel: "GESTOR", modoBaixoEstimulo: false, criadoEm: new Date("2026-09-01T08:00:00-03:00") }
]);

// ---------- locais (6 documentos, avaliacoes INCORPORADAS, usuario por REFERENCIA) ----------
db.locais.insertMany([
  {
    oracleId: 1,
    nome: "UBS Vila Mariana",
    categoria: "SAUDE",
    endereco: "Rua Joaquim Tavora, 1000 - Vila Mariana, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.634600, -23.589100] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 92,
    avaliacoes: [
      { oracleId: 1, usuarioId: 1, ruido: 1, luminosidade: 2, lotacao: 1, dataHoraVisita: new Date("2026-10-06T08:15:00-03:00"), comentario: "Recepcao silenciosa logo cedo." },
      { oracleId: 2, usuarioId: 3, ruido: 2, luminosidade: 1, lotacao: 1, dataHoraVisita: new Date("2026-10-08T09:40:00-03:00"), comentario: "Luz suave na sala de espera." },
      { oracleId: 3, usuarioId: 2, ruido: 1, luminosidade: 1, lotacao: 2, dataHoraVisita: new Date("2026-10-13T14:20:00-03:00") },
      { oracleId: 4, usuarioId: 4, ruido: 1, luminosidade: 2, lotacao: 1, dataHoraVisita: new Date("2026-10-20T16:50:00-03:00"), comentario: "Pouca gente no fim da tarde." }
    ]
  },
  {
    oracleId: 2,
    nome: "UBS Pinheiros",
    categoria: "SAUDE",
    endereco: "Rua Ferreira de Araujo, 800 - Pinheiros, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.693500, -23.566500] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 58,
    avaliacoes: [
      { oracleId: 5, usuarioId: 2, ruido: 3, luminosidade: 2, lotacao: 3, dataHoraVisita: new Date("2026-10-07T10:30:00-03:00"), comentario: "Fila grande para vacina." },
      { oracleId: 6, usuarioId: 4, ruido: 3, luminosidade: 2, lotacao: 4, dataHoraVisita: new Date("2026-10-09T11:10:00-03:00"), comentario: "Sala cheia e abafada." },
      { oracleId: 7, usuarioId: 1, ruido: 2, luminosidade: 2, lotacao: 3, dataHoraVisita: new Date("2026-10-15T15:00:00-03:00"), comentario: "TV ligada alta na recepcao." },
      { oracleId: 8, usuarioId: 3, ruido: 3, luminosidade: 2, lotacao: 3, dataHoraVisita: new Date("2026-10-22T17:30:00-03:00") }
    ]
  },
  {
    oracleId: 3,
    nome: "Mercado Municipal de Sao Paulo",
    categoria: "MERCADO",
    endereco: "Rua da Cantareira, 306 - Centro, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.629900, -23.541800] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 28,
    avaliacoes: [
      { oracleId: 9, usuarioId: 1, ruido: 4, luminosidade: 3, lotacao: 5, dataHoraVisita: new Date("2026-10-11T11:45:00-03:00"), comentario: "Sabado lotado, muito barulho." },
      { oracleId: 10, usuarioId: 2, ruido: 4, luminosidade: 3, lotacao: 4, dataHoraVisita: new Date("2026-10-14T07:30:00-03:00"), comentario: "Cedo ainda da para circular." },
      { oracleId: 11, usuarioId: 4, ruido: 4, luminosidade: 3, lotacao: 5, dataHoraVisita: new Date("2026-10-18T12:30:00-03:00") }
    ]
  },
  {
    oracleId: 4,
    nome: "Terminal Parque Dom Pedro II",
    categoria: "TRANSPORTE",
    endereco: "Av. do Estado - Parque Dom Pedro II, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.629000, -23.548800] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 19,
    avaliacoes: [
      { oracleId: 12, usuarioId: 3, ruido: 5, luminosidade: 3, lotacao: 5, dataHoraVisita: new Date("2026-10-06T18:10:00-03:00"), comentario: "Horario de pico, empurra-empurra." },
      { oracleId: 13, usuarioId: 2, ruido: 4, luminosidade: 3, lotacao: 5, dataHoraVisita: new Date("2026-10-07T07:50:00-03:00") },
      { oracleId: 14, usuarioId: 4, ruido: 5, luminosidade: 3, lotacao: 5, dataHoraVisita: new Date("2026-10-16T18:40:00-03:00"), comentario: "Onibus buzinando sem parar." }
    ]
  },
  {
    oracleId: 5,
    nome: "Parque Ibirapuera",
    categoria: "LAZER",
    endereco: "Av. Pedro Alvares Cabral - Vila Mariana, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.657600, -23.587400] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 72,
    avaliacoes: [
      { oracleId: 15, usuarioId: 1, ruido: 2, luminosidade: 2, lotacao: 3, dataHoraVisita: new Date("2026-10-12T10:00:00-03:00"), comentario: "Feriado com bastante gente." },
      { oracleId: 16, usuarioId: 3, ruido: 2, luminosidade: 1, lotacao: 3, dataHoraVisita: new Date("2026-10-19T16:30:00-03:00") },
      { oracleId: 17, usuarioId: 2, ruido: 2, luminosidade: 2, lotacao: 2, dataHoraVisita: new Date("2026-10-25T07:20:00-03:00"), comentario: "Manha de domingo tranquila." }
    ]
  },
  {
    oracleId: 6,
    nome: "Poupatempo Se",
    categoria: "SERVICO_PUBLICO",
    endereco: "Praca do Carmo - Se, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.631600, -23.550200] },  // GeoJSON: [longitude, latitude]
    indiceCalma: 50,
    avaliacoes: [
      { oracleId: 18, usuarioId: 4, ruido: 3, luminosidade: 2, lotacao: 4, dataHoraVisita: new Date("2026-10-08T13:00:00-03:00"), comentario: "Horario de almoco cheio." },
      { oracleId: 19, usuarioId: 1, ruido: 2, luminosidade: 2, lotacao: 4, dataHoraVisita: new Date("2026-10-10T08:30:00-03:00") },
      { oracleId: 20, usuarioId: 3, ruido: 4, luminosidade: 2, lotacao: 4, dataHoraVisita: new Date("2026-10-21T14:45:00-03:00"), comentario: "Senha demorou, ambiente agitado." }
    ]
  }
]);

// ---------- estacoes (5 documentos, equipamentos e ultimos reportes INCORPORADOS) ----------
db.estacoes.insertMany([
  {
    oracleId: 1,
    nome: "Se",
    linha: "1-Azul / 3-Vermelha",
    endereco: "Praca da Se - Se, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.633900, -23.550300] },
    equipamentos: [
      {
        oracleId: 1, tipo: "ELEVADOR", localizacao: "Praca da Se -> mezanino",
        statusAtual: "PARADO", atualizadoEm: new Date("2026-11-03T07:45:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 6, usuarioId: 2, status: "PARADO", observacao: "Elevador parado, cadeirante precisou de ajuda.", criadoEm: new Date("2026-11-03T07:45:00-03:00") },
          { oracleId: 1, usuarioId: 1, status: "FUNCIONANDO", observacao: "Elevador ok pela manha.", criadoEm: new Date("2026-11-01T08:10:00-03:00") }
        ]
      },
      {
        oracleId: 2, tipo: "ESCADA_ROLANTE", localizacao: "Mezanino -> plataforma Linha 3 sentido Barra Funda",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      },
      {
        oracleId: 3, tipo: "RAMPA", localizacao: "Acesso Rua Roberto Simonsen",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      }
    ]
  },
  {
    oracleId: 2,
    nome: "Paraiso",
    linha: "1-Azul / 2-Verde",
    endereco: "Rua Vergueiro, 1300 - Paraiso, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.640800, -23.576200] },
    equipamentos: [
      {
        oracleId: 4, tipo: "ELEVADOR", localizacao: "Rua Vergueiro -> mezanino",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-03T15:00:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 8, usuarioId: 5, status: "FUNCIONANDO", observacao: "Porta consertada.", criadoEm: new Date("2026-11-03T15:00:00-03:00") },
          { oracleId: 3, usuarioId: 2, status: "PARADO", observacao: "Porta do elevador nao abre.", criadoEm: new Date("2026-11-02T08:00:00-03:00") }
        ]
      },
      {
        oracleId: 5, tipo: "ESCADA_ROLANTE", localizacao: "Mezanino -> plataforma Linha 2",
        statusAtual: "EM_MANUTENCAO", atualizadoEm: new Date("2026-11-02T10:00:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 5, usuarioId: 5, status: "EM_MANUTENCAO", observacao: "Manutencao programada ate 20/11.", criadoEm: new Date("2026-11-02T10:00:00-03:00") }
        ]
      },
      {
        oracleId: 6, tipo: "PLATAFORMA", localizacao: "Escada fixa do acesso Rua Tutoia",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      }
    ]
  },
  {
    oracleId: 3,
    nome: "Luz",
    linha: "1-Azul / 4-Amarela",
    endereco: "Praca da Luz - Luz, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.633900, -23.536500] },
    equipamentos: [
      {
        oracleId: 7, tipo: "ELEVADOR", localizacao: "Acesso Rua Jose Paulino -> mezanino",
        statusAtual: "PARADO", atualizadoEm: new Date("2026-11-04T17:30:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 9, usuarioId: 4, status: "PARADO", observacao: "Parou de novo no fim da tarde.", criadoEm: new Date("2026-11-04T17:30:00-03:00") },
          { oracleId: 4, usuarioId: 5, status: "FUNCIONANDO", observacao: "Equipe tecnica liberou o elevador.", criadoEm: new Date("2026-11-02T09:00:00-03:00") },
          { oracleId: 2, usuarioId: 3, status: "PARADO", observacao: "Elevador parado, sem aviso no local.", criadoEm: new Date("2026-11-01T18:20:00-03:00") }
        ]
      },
      {
        oracleId: 8, tipo: "ESCADA_ROLANTE", localizacao: "Baldeacao Linha 1 -> Linha 4",
        statusAtual: "PARADO", atualizadoEm: new Date("2026-11-04T17:35:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 10, usuarioId: 4, status: "PARADO", observacao: "Escada desligada na baldeacao.", criadoEm: new Date("2026-11-04T17:35:00-03:00") }
        ]
      }
    ]
  },
  {
    oracleId: 4,
    nome: "Consolacao",
    linha: "2-Verde",
    endereco: "Av. Paulista, 2163 - Consolacao, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.660400, -23.557700] },
    equipamentos: [
      {
        oracleId: 9, tipo: "ELEVADOR", localizacao: "Av. Paulista -> mezanino",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-03T12:00:00-03:00"),
        ultimosReportes: [   // mais recente primeiro (no maximo 5)
          { oracleId: 7, usuarioId: 1, status: "FUNCIONANDO", criadoEm: new Date("2026-11-03T12:00:00-03:00") }
        ]
      },
      {
        oracleId: 10, tipo: "ESCADA_ROLANTE", localizacao: "Mezanino -> plataforma sentido Vila Prudente",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      }
    ]
  },
  {
    oracleId: 5,
    nome: "Butanta",
    linha: "4-Amarela",
    endereco: "Av. Vital Brasil, 1000 - Butanta, Sao Paulo/SP",
    localizacao: { type: "Point", coordinates: [-46.708000, -23.571900] },
    equipamentos: [
      {
        oracleId: 11, tipo: "ELEVADOR", localizacao: "Av. Vital Brasil -> plataforma",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      },
      {
        oracleId: 12, tipo: "RAMPA", localizacao: "Acesso terminal de onibus",
        statusAtual: "FUNCIONANDO", atualizadoEm: new Date("2026-11-01T00:00:00-03:00"),
        ultimosReportes: []
      }
    ]
  }
]);

// ---------- conferencia ----------
// Esperado: usuarios 5 | locais 6 | estacoes 5 | total 16 documentos
print('usuarios : ' + db.usuarios.countDocuments());
print('locais   : ' + db.locais.countDocuments());
print('estacoes : ' + db.estacoes.countDocuments());
print('TOTAL    : ' + (db.usuarios.countDocuments() + db.locais.countDocuments() + db.estacoes.countDocuments()) + ' documentos');
