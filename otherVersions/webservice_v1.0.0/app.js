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
  user: 'root',
  database: 'acessoportal',
  host: 'localhost',
  password: 'toor'
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Qtd de acessos de cada sistema por periodo
app.get('/sistemas/:dataIni/:dataFim', function(req, res){

  var sql = "select sistema, count(1) as qtd from contadorsistema";
  sql += " where";
  sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
  sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
  sql += " group by sistema";

  connection.query(sql, function(err, rows) {
      if(err){ throw err; }
      res.send(rows);
  });
});

// Qtd de acessos diarios ao sistema
app.get('/sistema/:sistema/:dataIni/:dataFim', function(req, res){

  var sql = "select convert(logcadastro,date) as dia, count(1) as qtd from contadorsistema";
  sql += " where sistema = '"+req.params.sistema+"' and";
  sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
  sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
  sql += " group by convert(logcadastro, date)";


  connection.query(sql,function(err, rows) {
      if(err){ throw err; }
      res.send(rows);
  });
});

// Qtd de acessos diarios ao portal
app.get('/portal/:dataIni/:dataFim', function(req, res){

  var sql = "select convert(logcadastro,date) as dia, count(1) as qtd from contadorportal";
  sql += " where";
  sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
  sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
  sql += " group by convert(logcadastro, date)";


  connection.query(sql,function(err, rows) {
      if(err){ throw err; }
      res.send(rows);
  });
});

var data = [];
var incremento = 0;
app.get('/incremento/:dataIni/:dataFim', function(req, res){

    var sql = "select convert(logcadastro,date) as dia, count(1) as qtd from contadorportal";
    sql += " where";
    sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
    sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
    sql += " group by convert(logcadastro, date)";

    connection.query(sql,function(err, rows) {
        if(err){ throw err; }

        data = rows;
        var dataFinal = ["teste", rows];
        res.send(dataFinal);

        incremento++;
        console.log(incremento);
    });
});

// Navegadores mais utilizados
app.get('/browser/:dataIni/:dataFim', function(req, res){

  var sql = "select left(navegador,7) as browser, count(1) as qtd, (select count(1) from contadorportal) as total, convert((count(1) / (select count(1) from contadorportal)) * 100, decimal(8,2)) as porCent from contadorportal";
  sql += " where";
  sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
  sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
  sql += " group by left(navegador,7)";


  connection.query(sql,function(err, rows) {
      if(err){ throw err; }
      res.send(rows);
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
