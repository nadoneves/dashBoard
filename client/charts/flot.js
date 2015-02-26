

$(function() {

    // We use an inline data source in the example, usually data would
    // be fetched from a server

    var data = [],
    totalPoints = 100;

    var c;
    var real = true;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getRandomData() {

        if (data.length > 0)
          data = data.slice(1);


          $.ajax({
              url: "http://intranet.faetec.rj.gov.br:3000/flot",
              type: "GET",
              success: function(d)
              {
                var msg;
                if(d > 1000)
                {
                  c = 1000;
                  msg = "+1000";
                }
                else
                {
                  c = d;
                  msg = d;
                }

                $('#accessFooter').text("Quantidade de acessos: " + msg);
              }
          });


          if(real)
              c = c;
          else
              c = getRandomInt(0,c);

          while (data.length < totalPoints) {
            data.push(c);
          }

          var res = [];
          for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]]);
          }

          if(real)
              real = false;
          else
              real = true;

          return res;
    }

        // Set up the control widget

        var updateInterval = 100;
        $("#updateInterval").val(updateInterval).change(function () {
            var v = $(this).val();
            if (v && !isNaN(+v)) {
                updateInterval = +v;
                if (updateInterval < 1) {
                    updateInterval = 1;
                } else if (updateInterval > 2000) {
                    updateInterval = 2000;
                }
                $(this).val("" + updateInterval);
            }
        });

        var plot = $.plot("#access", [ getRandomData() ], {
            series: {
                shadowSize: 0	// Drawing is faster without shadows
            },
            yaxis: {
                min: 0,
                max: 1000
            },
            xaxis: {
                show: false
            }
        });

        function update() {

            plot.setData([getRandomData()]);

            // Since the axes don't change, we don't need to call plot.setupGrid()

            plot.draw();
            setTimeout(update, updateInterval);
        }

        update();

    });
