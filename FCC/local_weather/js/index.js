 //DATA
 var testData = {
   "response": {
     "version": "0.1",
     "termsofService": "http://www.wunderground.com/weather/api/d/terms.html",
     "features": {
       "conditions": 1
     }
   },
   "current_observation": {
     "image": {
       "url": "http://icons.wxug.com/graphics/wu2/logo_130x80.png",
       "title": "Weather Underground",
       "link": "http://www.wunderground.com"
     },
     "display_location": {
       "full": "Newton, NJ",
       "city": "Newton",
       "state": "NJ",
       "state_name": "New Jersey",
       "country": "US",
       "country_iso3166": "US",
       "zip": "07860",
       "magic": "3",
       "wmo": "99999",
       "latitude": "41.050000",
       "longitude": "-74.750000",
       "elevation": "197.00000000"
     },
     "observation_location": {
       "full": "Lake Mohawk, Hillside/Springbrook, Sparta Township, New Jersey",
       "city": "Lake Mohawk, Hillside/Springbrook, Sparta Township",
       "state": "New Jersey",
       "country": "US",
       "country_iso3166": "US",
       "latitude": "41.009884",
       "longitude": "-74.660088",
       "elevation": "869 ft"
     },
     "estimated": {},
     "station_id": "KNJSPART13",
     "observation_time": "Last Updated on June 22, 4:55 PM EDT",
     "observation_time_rfc822": "Wed, 22 Jun 2016 16:55:35 -0400",
     "observation_epoch": "1466628935",
     "local_time_rfc822": "Wed, 22 Jun 2016 16:56:01 -0400",
     "local_epoch": "1466628961",
     "local_tz_short": "EDT",
     "local_tz_long": "America/New_York",
     "local_tz_offset": "-0400",
     "weather": "Partly Cloudy",
     "temperature_string": "78.8 F (26.0 C)",
     "temp_f": 78.8,
     "temp_c": 26.0,
     "relative_humidity": "36%",
     "wind_string": "From the WNW at 1.1 MPH Gusting to 2.5 MPH",
     "wind_dir": "WNW",
     "wind_degrees": 296,
     "wind_mph": 1.1,
     "wind_gust_mph": "2.5",
     "wind_kph": 1.8,
     "wind_gust_kph": "4.0",
     "pressure_mb": "1011",
     "pressure_in": "29.86",
     "pressure_trend": "0",
     "dewpoint_string": "50 F (10 C)",
     "dewpoint_f": 50,
     "dewpoint_c": 10,
     "heat_index_string": "NA",
     "heat_index_f": "NA",
     "heat_index_c": "NA",
     "windchill_string": "NA",
     "windchill_f": "NA",
     "windchill_c": "NA",
     "feelslike_string": "78.8 F (26 C)",
     "feelslike_f": "78.8",
     "feelslike_c": "26",
     "visibility_mi": "10.0",
     "visibility_km": "16.1",
     "solarradiation": "106",
     "UV": "2.0",
     "precip_1hr_string": "0.00 in ( 0 mm)",
     "precip_1hr_in": "0.00",
     "precip_1hr_metric": " 0",
     "precip_today_string": "0.00 in (0 mm)",
     "precip_today_in": "0.00",
     "precip_today_metric": "0",
     "icon": "partlycloudy",
     "icon_url": "http://icons.wxug.com/i/c/k/partlycloudy.gif",
     "forecast_url": "http://www.wunderground.com/US/NJ/Fredon_Township.html",
     "history_url": "http://www.wunderground.com/weatherstation/WXDailyHistory.asp?ID=KNJSPART13",
     "ob_url": "http://www.wunderground.com/cgi-bin/findweather/getForecast?query=41.009884,-74.660088",
     "nowcast": ""
   }
 };
 var city = "",
   weather = "Clear",
   weatherIcon = "clear",
   tempF = 0,
   tempC = 0,
   //UI & Styles
   UIConditions = $(".conditions"),
   UIcurrLoc = $(".city"),
   UIcurrTemp = $(".temp"),
   UIIcon = $(".weather-icon"),
   UIDebug = $(".debug");
 //METHODS
 var callWeatherAPI = function(lat, long) {
   $(".my-loader").fadeIn();
   var apiUrl = "https://api.wunderground.com/api/1a44b93cc6d20dab/conditions/q/";
   apiUrl += lat + "," + long + ".json";
   $.ajax({
     type: 'GET',
     url: apiUrl,
     data: {
       format: 'json'
     },
     error: function() {
       alert(error.message);
     },
     success: function(data) {
       parseWeatherData(data);  
       setUI(data);
     }
   });
 };

 var parseWeatherData = function(wxData) {
   city = wxData.current_observation.display_location.full;
   tempF = Math.floor(wxData.current_observation.temp_f);
   tempC = Math.floor(wxData.current_observation.temp_c);
   weather = wxData.current_observation.weather;
   weatherIcon = wxData.current_observation.icon;
 };

 var setUI = function() {
   UIcurrLoc.text(city);
   UIcurrTemp.text(tempF);
   UIConditions.text(weather);
   $("#btnC").css("color", "#ccc");
   $("body").removeClass();
   $("body").addClass("background-image");
   switch (weatherIcon) {
     case "cloudy":
       $("body").addClass("wx-cloudy");
       break;
     case "partlycloudy":
     case "mostlycloudy":
       $("body").addClass("wx-partlyCloudy");
       break;
     case "clear":
       $("body").addClass("wx-sunny");
       break;
     case "rain":
     case "tstorms":
       $("body").addClass("wx-rain");
       break;
     case "snow":
       $("body").addClass("wx-snow");
       break;
     default:
       $("body").addClass("wx-cloudy");
       break;
   };
   $(".loading-content").fadeOut("fast");
   $(".weather-content").fadeIn("slow");
 };

 var geoLocate = function() {
   if (!navigator.geolocation) {
     alert("Geolocation is not supported by your browser or device.");
     return;
   }

   function success(position) {
     var latitude = position.coords.latitude;
     var longitude = position.coords.longitude;
     callWeatherAPI(latitude, longitude);
   };

   function error(error) {
     if(error.code === 1 || error.code === 2){
       alert("Unable to retrieve your location. Try opening the application on the CodePen.io https site if your location isn't loading.\n \nLocation services are required for the app to work.");
       $(".location-error-content").fadeIn("fast");
       $(".loading-content").fadeOut("fast");
     } else alert(error.code + " - Unable to retrieve your location: " + error.message);
   };

   navigator.geolocation.getCurrentPosition(success, error);
 };

 $(".btn-temp").click(function() {
   $(".btn-temp").css("color", "#ccc");
   $(this).css("color", "#fff");
   if (this.id === "btnC") {
     UIcurrTemp.text(tempC);
   } else UIcurrTemp.text(tempF);
 });

 $(document).ready(function() {
   geoLocate();
 });