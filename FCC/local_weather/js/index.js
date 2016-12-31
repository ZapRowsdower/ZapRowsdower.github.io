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
