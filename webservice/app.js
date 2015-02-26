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
  database: 'acessoportal',
  host: '192.168.0.22',
  password: 'leonardo'
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

app.get('/incremento/:dataIni/:dataFim/:inc', function(req, res){

    var sql = "select convert(logcadastro,date) as dia, count(1) as qtd from contadorportal";
    sql += " where";
    //sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
    //sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
    //sql += " convert(logcadastro, date) = '2014-08-"+req.params.inc+"'";
    sql += " convert(logcadastro, date) = '2014-08-"+req.params.inc+"'";
    sql += " group by convert(logcadastro, date)";

    connection.query(sql,function(err, rows) {
        if(err){ throw err; }

        for (var i = 0; i < rows.length; i++) {
          data.push([incremento, rows[i]["qtd"]]);
        }


        var dataFinal = {label:"TESTE", data:data};
        res.send(dataFinal);

        incremento++;
    });
});

app.get('/flot', function(req, res){

    var Hoje = new Date();
    var dia = Hoje.getFullYear() + '-' + (Hoje.getMonth() + 1) + '-' + Hoje.getDate();
    var dataHora = dia + " " + Hoje.getHours() + ":" + Hoje.getMinutes() + ":" + Hoje.getSeconds();;

    var sql = "select count(1) as qtd from contadorportal";
    sql += " where";
    //sql += " convert(logcadastro, date) >= '"+req.params.dataIni+"' and";
    //sql += " convert(logcadastro, date) <= '"+req.params.dataFim+"'";
    //sql += " convert(logcadastro, date) = '2014-08-"+req.params.inc+"'";
    sql += " logcadastro >= '"+dia+" 00:00:00' and logcadastro <= '"+dataHora+"'" ;
    //sql += " group by logcadastro";

    connection.query(sql,function(err, rows) {
        if(err){ throw err; }
        res.send(String(rows[0]['qtd']));
        //console.log(dataHora + " // " + rows[0]['qtd']);
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
