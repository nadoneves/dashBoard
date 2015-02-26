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
  database: 'mysql',
  host: '200.141.74.163',
  password: 'tjlyn11'
});

// Navegadores mais utilizados
app.get('/', function(req, res){

  var sql = "SHOW PROCESSLIST";

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
