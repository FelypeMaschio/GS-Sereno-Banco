// =====================================================================
// SERENO - MongoDB
// Seleciona/cria o database "sereno" e cria as collections com validacao.
//   usuarios : 1 documento por usuario (referenciado pelas avaliacoes/reportes)
//   locais   : 1 documento por local, com as avaliacoes INCORPORADAS
//   estacoes : 1 documento por estacao, com equipamentos e ultimos reportes INCORPORADOS
// Como rodar: colar no shell do MongoDB Compass (_MONGOSH) ou
//             mongosh --file 1_estrutura_collections.js
// Pode rodar de novo: apaga as collections antes de recriar.
// =====================================================================

// seleciona (e cria, no primeiro insert) o database
use('sereno');
db = db.getSiblingDB('sereno');   // garante o database mesmo se rodado com --file

// ---------- LIMPEZA ----------
['usuarios', 'locais', 'estacoes'].forEach(function (nome) {
  if (db.getCollectionNames().includes(nome)) {
    db.getCollection(nome).drop();
    print('Collection removida: ' + nome);
  }
});

var NUMERO = ['int', 'long', 'double', 'decimal'];
var NOTA = { bsonType: NUMERO, minimum: 1, maximum: 5 };
var STATUS = { enum: ['FUNCIONANDO', 'PARADO', 'EM_MANUTENCAO'] };

// ---------- usuarios ----------
// (equivale aos CHECK/UNIQUE de SER_USUARIO; a senha NAO vem para o MongoDB)
db.createCollection('usuarios', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['oracleId', 'nome', 'email', 'papel'],
      properties: {
        oracleId: { bsonType: NUMERO },
        nome: { bsonType: 'string' },
        email: { bsonType: 'string', pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]+$' },
        papel: { enum: ['CIDADAO', 'GESTOR'] },
        modoBaixoEstimulo: { bsonType: 'bool' },
        criadoEm: { bsonType: 'date' }
      }
    }
  }
});

// ---------- locais ----------
db.createCollection('locais', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['oracleId', 'nome', 'categoria', 'avaliacoes'],
      properties: {
        oracleId: { bsonType: NUMERO },
        nome: { bsonType: 'string' },
        categoria: { enum: ['SAUDE', 'MERCADO', 'TRANSPORTE', 'LAZER', 'SERVICO_PUBLICO', 'EDUCACAO'] },
        indiceCalma: { bsonType: NUMERO.concat(['null']), minimum: 0, maximum: 100 },
        avaliacoes: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['oracleId', 'ruido', 'luminosidade', 'lotacao', 'dataHoraVisita'],
            properties: {
              oracleId: { bsonType: NUMERO },
              usuarioId: { bsonType: NUMERO.concat(['null']) },   // referencia a usuarios.oracleId
              ruido: NOTA,
              luminosidade: NOTA,
              lotacao: NOTA,
              dataHoraVisita: { bsonType: 'date' }
            }
          }
        }
      }
    }
  }
});

// ---------- estacoes ----------
db.createCollection('estacoes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['oracleId', 'nome', 'linha', 'equipamentos'],
      properties: {
        oracleId: { bsonType: NUMERO },
        nome: { bsonType: 'string' },
        linha: { bsonType: 'string' },
        equipamentos: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['oracleId', 'tipo', 'statusAtual'],
            properties: {
              oracleId: { bsonType: NUMERO },
              tipo: { enum: ['ELEVADOR', 'ESCADA_ROLANTE', 'RAMPA', 'PLATAFORMA'] },
              statusAtual: STATUS,
              ultimosReportes: {
                bsonType: 'array',
                maxItems: 5,   // limite do padrao "subset": so os 5 mais recentes ficam incorporados
                items: {
                  bsonType: 'object',
                  required: ['oracleId', 'status', 'criadoEm'],
                  properties: { status: STATUS, criadoEm: { bsonType: 'date' } }
                }
              }
            }
          }
        }
      }
    }
  }
});

// ---------- INDICES ----------
db.usuarios.createIndex({ oracleId: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.locais.createIndex({ oracleId: 1 }, { unique: true });
db.locais.createIndex({ categoria: 1, indiceCalma: -1 });        // relatorio 1
db.locais.createIndex({ localizacao: '2dsphere' });              // busca por proximidade
db.estacoes.createIndex({ oracleId: 1 }, { unique: true });
db.estacoes.createIndex({ 'equipamentos.statusAtual': 1 });      // relatorio 2
db.estacoes.createIndex({ localizacao: '2dsphere' });

print('Collections criadas: ' + db.getCollectionNames().sort().join(', '));
// Esperado: estacoes, locais, usuarios
