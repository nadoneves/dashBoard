var ip = "10.200.2.66:3000";

function pieBrowsers(dataIni, dataFim) {
  var json = $.ajax({
    type: "GET",
    url: "http://"+ ip +"/browser/"+dataIni+"/"+dataFim,
    dataType: "json",
    async: false,
    beforeSend: function(){ $('#info').removeClass('hide'); }
  }).responseText;

  var dps = Array();
  var array = $.parseJSON(json);

  for (var i = 0; i < array.length; i++) {
      dps.push({
        y:array[i]['porCent'],
        legendText:array[i]['browser'],
        indexLabel:array[i]['browser']+' ('+array[i]["porCent"]+'%)'
      });
  }

  var chart = new CanvasJS.Chart("pieBrowsers",
  {
    title:{
      text: "Navegadores utilizados nos acessos (%)"
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
}
