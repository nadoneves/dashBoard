

$(function() {

    // We use an inline data source in the example, usually data would
    // be fetched from a server

    var data = [],
    totalPoints = 100;

    var c;

    var sleep, query, pSleep, pQuery;


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getRandomData() {

        if (data.length > 0)
          data = data.slice(1);


          $.ajax({
              url: "http://intranet.faetec.rj.gov.br:3000/processlist",
              type: "GET",
              success: function(d)
              {
                var msg;
                if(d >= 151)
                {
                  c = 151;
                  msg = "+=151";
                }
                else
                {
                  c = d.length;
                  msg = d.length;

                }
                sleep = query = 0;
                pSleep = pQuery = "";
                for (var i = 0; i < d.length; i++) {
                    if(d[i]['Command'] == "Sleep")
                    {
                        sleep++;
                        pSleep = pSleep + "<tr><td>"+d[i]["User"]+"</td><td>"+d[i]["db"]+"</td></tr>";
                    }
                    else
                    {                        
                        if(d[i]["Info"] != "SHOW PROCESSLIST")
                        {
                            query++;
                            pQuery = pQuery + "<tr><td>"+d[i]["Info"]+"</td></tr>";
                        }
                    }
                }

                $('#labelSleep').html(sleep);
                $('#labelQuery').html(query);
                $('#tableSleep tbody').html(pSleep);
                $('#tableQuery tbody').html(pQuery);

                $('#mysqlFooter').text("Process: " + msg);
              }
          });

          while (data.length < totalPoints) {
            data.push(c);
          }

          var res = [];

          for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]]);

          }

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

        var plot = $.plot("#mysql", [ getRandomData() ], {
            series: {
                shadowSize: 0	// Drawing is faster without shadows
            },
            yaxis: {
                min: 0,
                max: 151
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
