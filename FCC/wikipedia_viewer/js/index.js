var wikiBaseUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&namespace=0&format=json&search=',
  // var wikiBaseUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&prop=pageimages|extracts&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=",
  $divMainContainer = $(".container-fluid main"),
  $divSearch = $("div.search"),
  $divSplashScreen = $("div.splash-screen"),
  $txtSearch = $("#txtSearch"),
  $btnSearch = $("#btnSearch"),
  $divDebug = $("#debug"),
  $listResults = $("ul.results"),
  $btnSearchWiki = $("#searchWiki"),
  $btnRandom = $("#randomWiki"),
  $header = $("header"),
  $divLoadSpinner = $("div.my-loader");

var searchWiki = function(searchTxt) {
  var wikiSearchUrl = wikiBaseUrl + searchTxt;
  $.ajax({
    type: 'GET',
    url: wikiSearchUrl,
    dataType: 'jsonp',
    error: function(error) {
      alert(error.message);
    },
    success: function(data) {
      $divLoadSpinner.hide();
      buildResults(data);
    }
  });
};
var openWiki = function(url) {
  window.open(url);
};
var buildList = function(data) {
  //for use with generator version of wiki api
  $listResults.empty();
  for (i = 0; i < data.length; i++) {
    $(".results").append("<li>" + data[i].snippet + "</li>");
  }
};
var buildResults = function(data) {
  $listResults.empty();
  for (i = 0; i < data[2].length; i++) {
    $listResults.append("<a target='_blank' href=" + data[3][i] + ">"+"<li><h3>"+data[1][i]+" <i class='fa fa-external-link'></i></h3>"+ data[2][i] + "</li></a>");
  }
};
var openSearch = function() {
  $divSplashScreen.hide();
  $divSearch.fadeIn("fast");
  $txtSearch.focus();
};
var reset = function() {
  $divSearch.hide();
  $divLoadSpinner.hide();
  $divSplashScreen.hide();
  $divSplashScreen.fadeIn(1000);
  $txtSearch.val("");
  $listResults.empty();
};
var beginSearch = function() {
  $divLoadSpinner.show();
  var searchTxt = $txtSearch.val();
  searchWiki(searchTxt);
};
$($btnSearch).click(function(e) {
  e.preventDefault();
  beginSearch();
});
$('input[type=search]').on('keydown', function(e) {
  if (e.which == 13) {
    e.preventDefault();
    beginSearch();
  }
});
$($btnRandom).click(function() {
  openWiki("https://en.wikipedia.org/wiki/Special:Random");
});
$($btnSearchWiki).click(function() {
  openSearch();
});
$header.click(function() {
  reset();
});
$(document).ready(function() {
  reset();
});
