// =====================================================================
// SERENO - MongoDB
// Os 3 relatorios exigidos (+ 1 bonus), equivalentes a PARTE 7 do Sereno_Oracle_Completo.sql.
// Rodar depois do 1_estrutura_collections.js e do 2_carga_documentos.js.
// Os resultados esperados estao comentados e sao IGUAIS aos do Oracle.
// =====================================================================
use('sereno');
db = db.getSiblingDB('sereno');

// =====================================================================
// RELATORIO 1 - Locais de SAUDE com indice de calma >= 70  (find com filtro)
// Oracle: SELECT ... FROM ser_local WHERE categoria = 'SAUDE' AND indice_calma >= 70
// Esperado: [ { oracleId: 1, nome: 'UBS Vila Mariana', categoria: 'SAUDE', indiceCalma: 92 } ]
// =====================================================================
print('\n===== RELATORIO 1 - Locais de saude com indice de calma >= 70 =====');
printjson(
  db.locais.find(
    { categoria: 'SAUDE', indiceCalma: { $gte: 70 } },
    { _id: 0, oracleId: 1, nome: 1, categoria: 1, indiceCalma: 1 }
  ).sort({ indiceCalma: -1 }).toArray()
);

// =====================================================================
// RELATORIO 2 - Estacoes com algum equipamento PARADO  (find em array incorporado)
// Oracle: SELECT ... FROM ser_estacao e WHERE EXISTS (SELECT 1 FROM ser_equipamento ...)
// Esperado: Se (oracleId 1) e Luz (oracleId 3). Paraiso nao entra (EM_MANUTENCAO).
// O filtro em "equipamentos.statusAtual" percorre o array sozinho: e o EXISTS do MongoDB.
// =====================================================================
print('\n===== RELATORIO 2 - Estacoes com algum equipamento parado =====');
printjson(
  db.estacoes.find(
    { 'equipamentos.statusAtual': 'PARADO' },
    { _id: 0, oracleId: 1, nome: 1, linha: 1 }
  ).sort({ oracleId: 1 }).toArray()
);

// Detalhe (equivale ao JOIN): so os equipamentos parados de cada estacao
print('\n----- RELATORIO 2 (detalhe) - equipamentos parados -----');
printjson(
  db.estacoes.aggregate([
    { $unwind: '$equipamentos' },
    { $match: { 'equipamentos.statusAtual': 'PARADO' } },
    { $project: {
        _id: 0,
        estacao: '$nome',
        equipamentoId: '$equipamentos.oracleId',
        tipo: '$equipamentos.tipo',
        localizacao: '$equipamentos.localizacao',
        desde: { $dateToString: { date: '$equipamentos.atualizadoEm', format: '%d/%m/%Y %H:%M', timezone: '-03:00' } }
    } },
    { $sort: { equipamentoId: 1 } }
  ]).toArray()
);

// =====================================================================
// RELATORIO 3 (AGREGACAO) - media de ruido, luminosidade e lotacao por categoria
// Oracle: SELECT categoria, ROUND(AVG(...),2) ... GROUP BY categoria
// $unwind "abre" o array (1 documento por avaliacao = 1 linha do JOIN)
// $group  = GROUP BY | $avg = AVG | $sum: 1 = COUNT(*)
// Esperado:
//   LAZER 2 / 1.67 / 2.67 (3) | MERCADO 4 / 3 / 4.67 (3) | SAUDE 2 / 1.75 / 2.25 (8)
//   SERVICO_PUBLICO 3 / 2 / 4 (3) | TRANSPORTE 4.67 / 3 / 5 (3)
// =====================================================================
print('\n===== RELATORIO 3 - Media sensorial por categoria (aggregate) =====');
printjson(
  db.locais.aggregate([
    { $unwind: '$avaliacoes' },
    { $group: {
        _id: '$categoria',
        mediaRuido: { $avg: '$avaliacoes.ruido' },
        mediaLuminosidade: { $avg: '$avaliacoes.luminosidade' },
        mediaLotacao: { $avg: '$avaliacoes.lotacao' },
        qtdAvaliacoes: { $sum: 1 }
    } },
    { $project: {
        _id: 0,
        categoria: '$_id',
        mediaRuido: { $round: ['$mediaRuido', 2] },
        mediaLuminosidade: { $round: ['$mediaLuminosidade', 2] },
        mediaLotacao: { $round: ['$mediaLotacao', 2] },
        qtdAvaliacoes: 1
    } },
    { $sort: { categoria: 1 } }
  ]).toArray()
);

// =====================================================================
// RELATORIO 4 (BONUS) - "mapa de calor" por faixa de horario com $bucket
// Percepcao = media de (ruido + luz + lotacao) / 3 -> quanto MENOR, mais calmo
// Esperado: 6 MANHA 2.7 (10) | 12 TARDE 2.5 (8) | 18 NOITE 4.33 (2)
// =====================================================================
print('\n===== RELATORIO 4 (bonus) - Percepcao por faixa de horario ($bucket) =====');
printjson(
  db.locais.aggregate([
    { $unwind: '$avaliacoes' },
    // hora da visita no fuso de Sao Paulo (as datas ficam gravadas em UTC)
    { $addFields: { horaVisita: { $hour: { date: '$avaliacoes.dataHoraVisita', timezone: '-03:00' } } } },
    { $bucket: {
        groupBy: '$horaVisita',
        boundaries: [6, 12, 18, 24],
        default: 'FORA_DO_HORARIO',
        output: {
          percepcao: { $avg: { $divide: [
            { $add: ['$avaliacoes.ruido', '$avaliacoes.luminosidade', '$avaliacoes.lotacao'] }, 3] } },
          qtdAvaliacoes: { $sum: 1 }
        }
    } },
    { $project: {
        _id: 0,
        faixaInicio: '$_id',
        faixa: { $switch: { branches: [
          { case: { $eq: ['$_id', 6] },  then: 'MANHA (06h-11h)' },
          { case: { $eq: ['$_id', 12] }, then: 'TARDE (12h-17h)' },
          { case: { $eq: ['$_id', 18] }, then: 'NOITE (18h-23h)' }
        ], default: 'FORA DO HORARIO' } },
        percepcaoMedia: { $round: ['$percepcao', 2] },
        qtdAvaliacoes: 1
    } }
  ]).toArray()
);

// =====================================================================
// REFERENCIA RESOLVIDA - $lookup (o "JOIN" do MongoDB) do usuarioId
// Mostra por que o usuario ficou como referencia: o nome vem da collection usuarios.
// =====================================================================
print('\n----- Avaliacoes da UBS Vila Mariana com o nome do autor ($lookup) -----');
printjson(
  db.locais.aggregate([
    { $match: { oracleId: 1 } },
    { $unwind: '$avaliacoes' },
    { $lookup: { from: 'usuarios', localField: 'avaliacoes.usuarioId', foreignField: 'oracleId', as: 'autor' } },
    { $project: {
        _id: 0,
        avaliacaoOracleId: '$avaliacoes.oracleId',
        autor: { $ifNull: [{ $arrayElemAt: ['$autor.nome', 0] }, 'anonimo'] },
        ruido: '$avaliacoes.ruido',
        luminosidade: '$avaliacoes.luminosidade',
        lotacao: '$avaliacoes.lotacao'
    } },
    { $sort: { avaliacaoOracleId: 1 } }
  ]).toArray()
);

// =====================================================================
// CORRESPONDENCIA Oracle x MongoDB - contagens que devem bater
// Esperado: usuarios 5 | locais 6 | avaliacoes 20 | estacoes 5 | equipamentos 12
// =====================================================================
print('\n===== CORRESPONDENCIA com o Oracle =====');
printjson({
  usuarios: db.usuarios.countDocuments(),
  locais: db.locais.countDocuments(),
  avaliacoes: db.locais.aggregate([{ $group: { _id: null, n: { $sum: { $size: '$avaliacoes' } } } }]).toArray()[0].n,
  estacoes: db.estacoes.countDocuments(),
  equipamentos: db.estacoes.aggregate([{ $group: { _id: null, n: { $sum: { $size: '$equipamentos' } } } }]).toArray()[0].n
});
