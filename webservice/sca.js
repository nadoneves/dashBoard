var express = require('express');
var mysql = require('mysql2');

var app = express();

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

var mysql      = require('mysql2');
var connection = mysql.createConnection({
  user: 'leonardo',
  database: 'scalunos',
  host: '10.200.2.66',
  password: 'tjlyn11'
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Qtd de acessos de cada sistema por periodo
app.get('/aluno/:cpf', function(req, res){

var sql = "select concat(tipo_unidade.tipo,' ',unidade.nome) as unidade, curso.curso,";
sql += " turma.nome_turma, situacao_turma_aluno.descricao as situacao,";
sql += " turma_aluno.classificacao, turma.vagas, aluno.nome_aluno";
sql += " from aluno";
sql += " inner join turma_aluno on turma_aluno.id_aluno = aluno.id";
sql += " inner join turma on turma_aluno.id_turma = turma.id";
sql += " inner join unidade_curso on turma.id_unidade_curso = unidade_curso.id";
sql += " inner join curso on unidade_curso.id_curso = curso.id";
sql += " inner join unidade on unidade_curso.id_unidade = unidade.id";
sql += " inner join tipo_unidade on unidade.id_tipo = tipo_unidade.id";
sql += " inner join situacao_turma_aluno on situacao_turma_aluno.id = turma_aluno.id_situacao";
sql += " where aluno.cpf = '"+req.params.cpf+"'";
sql += " and turma.id_rodada = (select id from rodadas where atual = 1)";


  connection.query(sql, function(err, rows) {
      if(err){ throw err; }
      res.send(rows);
  });
});

var server = app.listen(4000, function () {

  var host = server.address().address;
  var port = server.address().port;

//  console.log('Example app listening at http://%s:%s', host, port);

});
