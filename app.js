/**
 * Created by leah on 1/9/14.
 */

var searchId = $("#search-id"),
    buttonId = $("#button-id"),
    content = $("#content"),
    message = $("#message"),
    cityname = $("#city-name"),

// the .done deferred Promise callback - this could be cleaned up with templating
    showOutput = function(out) {
        content.text(Date(out.currently.time));
        content.append("</br> </br> Temperature : " + out.currently.temperature + "F </br>");
        content.append(" </br> Humidity :  " + out.currently.humidity + "% </br>");
        content.append(" </br>Icon: " + out.currently.icon + "</br>");
        content.append(" </br>Wind Speed: " + out.currently.windSpeed + "mph </br>");
        content.append(" </br>Visibility: " + out.currently.visibility + "m </br>");
        content.append(" </br>pressure: " + out.currently.pressure + "mb");
        return message.text("Summary: " + out.daily.summary);
    },

// The .fail deferred Promise callback
    showError = function(err) {
        if (err) console.error(err);
        return message.text("Forecast for Developers website got busy processing your request. Please try again later.");
    },

//  that url is kind of bulky, let's drop it in a function that just returns the parsed uri
    parseGeo = function(lat, lon) {
        return 'https://api.forecast.io/forecast/73ae89cc503818fc307b31e9445b5a47/' + lat + ',' + lon;
    };

// Okay! We're still using basically the same convention - event listeners trigger asynchrounous requests
searchId.on("keydown", function() {

    // no need to operate on the event, just pass this to jQuery to scope access to jQuery methods such as .val()
    var address = $(this).val(),
        checkAddress = address.substr(address.indexOf(",") + 1);

    // Some quick and dirty validation; more resilient and device-agnostic input validation than keycodes
    if (address.indexOf(",") != -1) {
        if (checkAddress.replace(" ", "").length == 2) {

            // Set up query data for google api call
            var dataparam = {
                sensor: false,
                address: address
            };

            // The click listener only attaches if the search input is valid and ready to send
            buttonId.on("click", function() {

                // Set a token to capture the jqXHR objects so we can chain deferred Promises to it
                var request = $.ajax({
                        data: dataparam,
                        url:'http://maps.googleapis.com/maps/api/geocode/json'
                    }),

                // Set up handlers for the deferred promise -
                    chained = request.then(

                        // success - .done
                        function(data) {
                            message.empty();
                            cityname.text("Current weather in " + data.results[0].address_components[0].long_name);
                            console.log(data);

                            // Return the resolved jqXHR deferred Promise - this will be chained to the next call
                            return $.ajax({
                                dataType: "jsonp",
                                url: parseGeo(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng)
                            });
                        },

                        // fail - .fail
                        function(err) {
                            return showError(err);
                        }
                    );
                // .then is simply shorthand for .done and .fail, which looks like this when written out longhand -
                // if the request succeeded, return the success handler
                chained.done(
                    function(data) {
                        return showOutput(data);
                    })
                    // .fail - if the request fails for any reason
                    .fail(
                    function(err) {
                        return showError(err);
                    }
                );
            });
        }
    }
});