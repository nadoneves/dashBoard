$(function(){

    var Hoje = new Date();
    var dataIniAtual = Hoje.getFullYear() + '-' + (Hoje.getMonth() + 1) + '-01';
    var dataFimAtual = Hoje.getFullYear() + '-' + (Hoje.getMonth() + 1) + '-' + Hoje.getDate();

    var dataIni = dataIniAtual;
    var dataFim = dataFimAtual;

    var updateInterval = 1000;

    var dps = Array();


    function getRandomData() {

        $.ajax({
            url: "http://intranet.faetec.rj.gov.br:3000/flot",
            type: "GET",
            success: function(d)
            {
                $('#accessFooter').text("Quantidade de acessos de hoje: " + d);                
            }
        });

        var json = $.ajax({
            url: "http://intranet.faetec.rj.gov.br:3000/portal/"+dataIni+"/"+dataFim,
            type: "GET",
            dataType: "json",
            async: false
        }).responseText;

        var array = $.parseJSON(json);

        var res = [];
        for (var i = 0; i < array.length; i++) {
            var d = array[i]["dia"].split('T');
            dps.push({
                x:i+1*10,
                y:array[i]["qtd"],
                label:d[0].split('-')[2]
            });
        }

        return res;


    } // End getRandomData()

    getRandomData();

    var chart = new CanvasJS.Chart("access",
        {
            title:{
                //text: "Top Oil Reserves"
            },
            data: [
                {
                    color: "#F5A52A",
                    dataPoints: dps
                }
            ]
        });

    chart.render();


    var updateChart = function update() {

        getRandomData();
        chart.render();
    }

    setInterval(function(){updateChart()}, updateInterval);


});
