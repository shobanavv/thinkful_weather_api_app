$(document).ready(function(){
    var findWeather, showOutput, getForecast;
    var findItem;
    var url1, url2;
    $("#search-id").keydown(function(event){
        if(event.keyCode === 13) {
            findWeather(findItem);
        }
});
   
$("#search-id").focus();
    
$("#button-id").click(function() {
    findItem = $("#search-id").val();           //Gets user input.
    $("#content").empty();
    $("#message").empty();
    if (findItem == "") {
        $("#message").text(" Enter a city name and State to find weather.");        //blank input message.
    } else {
        $("#search-id").val("");            
        findWeather(findItem);              //calls function to find weather.
    }
});

showOutput = function(out) {               //showoutput displays information received from json object from Forecast for developers.
    var contentElem = $("#content");
    contentElem.text(Date(out.currently.time));
    contentElem.append("</br> </br> Temperature : " + out.currently.temperature + "F </br>");
    contentElem.append(" </br> Humidity :  " + out.currently.humidity + "% </br>");
    contentElem.append(" </br>icon: " + out.currently.icon + "</br>");
    contentElem.append(" </br>Wind Speed: " + out.currently.windSpeed + "mph </br>");
    contentElem.append(" </br>Visibility: " + out.currently.visibility + "m </br>");
    contentElem.append(" </br>pressure: " + out.currently.pressure + "mb");  
    $("#message").text("Summary: " + out.daily.summary);    
};

getForecast = function(data) {
    $("#message").empty();
    $("#city-name").text("Current weather in" + data.results[0].address_components[0].long_name);       //Output city name.
    console.log(data);
    url2 = 'https://api.forecast.io/forecast/73ae89cc503818fc307b31e9445b5a47/' + data.results[0].geometry.location.lat +',' + data.results[0].geometry.location.lng;
    
    $.ajax({                    //calls Forecast for Developers api to get current weather information.
        dataType: "jsonp",
        url: url2,
        success: showOutput,      // calls showOutput to display current weather for specified city name.
        error: function() {
            $("#message").text("Forecast for Developers website got busy processing your request. Please try again later.");
        }
    });
};


findWeather = function(address) {
    url1 = 'http://maps.googleapis.com/maps/api/geocode/json';      //Gets longitude and lattitude from Googleapi.
    var dataparam = {
        sensor: false,                           //these 2 parameters required to send to Google api to get latitude and longitude.
        address: address
    };
    $.ajax ({                                    //makes ajax call 
        data: dataparam,
        dataType: "json",
        url: url1,
        success: getForecast,           //calls back (getForecast)Forecast for Developers api to find weather for that lat and long.
        error: function() {
             $("#message").text("Enter a proper city name.");
        }
        
    });
};

});
