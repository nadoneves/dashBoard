var ip = "10.200.2.66:3000";

function columnChartSystem(system, dataIni, dataFim) {
  var json = $.ajax({
    type: "GET",
    url: "http://"+ ip +"/sistema/"+system+"/"+dataIni+"/"+dataFim,
    dataType: "json",
    async: false,
    beforeSend: function(){
        $('#info').removeClass('hide');
    }
  }).responseText;

  var dps = Array();
  var array = $.parseJSON(json);

  for (var i = 0; i < array.length; i++) {
      var d = array[i]["dia"].split('T');
      dps.push({
        //x:i+1*10,
        y:array[i]["qtd"],
        label:d[0]
      });
  }

  var chart = new CanvasJS.Chart("chart"+system,
  {
    title:{
      text: "Quantidade de acessos diários em " + system
    },
    data: [
      {
        color: "#B0D0B0",
        type: "bar",
        dataPoints: dps
      }
    ]
  });

  chart.render();
}

function pieAllSystems(dataIni, dataFim) {
  var json = $.ajax({
    type: "GET",
    url: "http://"+ ip +"/sistemas/"+dataIni+"/"+dataFim,
    dataType: "json",
    async: false
  }).responseText;

  var dps = Array();
  var array = $.parseJSON(json);

  for (var i = 0; i < array.length; i++) {
      dps.push({
        y:array[i]["qtd"],
        legendText:array[i]["sistema"],
        indexLabel:array[i]["sistema"] + ' ('+String(array[i]["qtd"])+')'
      });

      $('#rowCharts').append('<div class="col-md-6"><div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title">'+array[i]['sistema']+'</h3></div><div class="panel-body"><div id="chart'+array[i]['sistema']+'" style="height: 300px; width: 100%;"></div></div><div class="panel-footer">Quantindade de acessos '+array[i]['qtd']+'</div></div></div>');
      columnChartSystem(array[i]['sistema'], dataIni, dataFim);
  }

  var chart = new CanvasJS.Chart("pieAllSystems",
  {
    title:{
      text: "Quantidade de acessos aos sistemas da Intranet"
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        dataPoints: dps
      }
    ]
  });

  chart.render();

  $('#info').addClass('hide');
}
