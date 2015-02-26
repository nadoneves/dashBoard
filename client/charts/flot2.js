$(function() {

    var options = {
        lines: {
            show: true
        },
        points: {
            show: true
        },
        xaxis: {
            tickDecimals: 0,
            tickSize: 1
        }
    };

    var data = [];

    var alreadyFetched = {};


        $.plot("#access", data, options);

        var iteration = 0;

        function fetchData() {

            ++iteration;

            function onDataReceived(series) {

                // Load all the data in one pass; if we only got partial
                // data we could merge it with what we already have.

                data = [ series ];
                $.plot("#access", data, options);
            }

            // Normally we call the same URL - a script connected to a
            // database - but in this case we only have static example
            // files, so we need to modify the URL.

            $.ajax({
                url: "http://192.168.0.10:3000/incremento/2014-01-01/2015-01-27/"+iteration,
                type: "GET",
                dataType: "json",
                success: onDataReceived
            });

            if (iteration < 5) {
                setTimeout(fetchData, 100);
            } else {
                data = [];
                alreadyFetched = {};
            }
        }

        setTimeout(fetchData, 100);


});
