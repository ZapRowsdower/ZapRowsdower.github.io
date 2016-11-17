//DATA ------//
var streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "noobs2ninjas"],
  streamerObjs = [],
  twitchBaseUrl = "https://api.twitch.tv/kraken/",

  //UI Hooks ------//
  $divStreamers = $(".div-streamers"),
  $ulStreamers = $(".list-streamers");

//METHODS-------//
var buildStreamerUI = function(streamerObj, streamer) {
  if (streamerObj.hasOwnProperty('error')) {
    $ulStreamers.append("<li class='offline' id=" + streamer + "><i class='fa fa-ban'>&nbsp;</i>" + streamer + "<span> account not found</span></li>");
  } else {
    $ulStreamers.append("<li id=" + streamerObj.display_name + "></li>");
    var $currLi = $("li#" + streamerObj.display_name);
    $currLi.append("<a target='_new' href=" + streamerObj.url + "><img class='logo' src=" + streamerObj.logo + "> " +
      streamerObj.display_name + "</a>");
    if (streamerObj.status === null || streamerObj.status === undefined) {
      //offline
      $currLi.addClass('offline');
      $currLi.append("<span> is offline</span>");
    } else {
       //online
      $currLi.addClass('online');
      $currLi.append("<span> is streaming " + streamerObj.status + "</span>");
    }
  }
};

var buildStreamerList = function(streamers) {
  for (i = 0; i < streamers.length; i++) {
    getChannel(streamers[i]);
  }
};

var checkStream = function(channelData, streamer) {
  var streamUrl = twitchBaseUrl + "streams/" + streamer;
  $.ajax({
    type: 'GET',
    url: streamUrl,
    headers: {
      'Client-ID': 'egde13ylh4s8475jv00o5ltcdlwuahi'
    },
    error: function(error) {
      alert(error.message);
    },
    success: function(data) {
      channelData.streamStatus = data.stream;
      streamerObjs.push(channelData);
      buildStreamerUI(channelData, streamer);
    }
  });
};

var getChannel = function(streamer) {
  // var channelUrl = twitchBaseUrl+"channels/"+streamer+"?callback=?";
  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/channels/' + streamer,
    headers: {
      'Client-ID': 'egde13ylh4s8475jv00o5ltcdlwuahi'
    },
    error: function(error) {
      alert(error.message);
    },
    success: function(channelData) {
      var streamUrl = twitchBaseUrl + "streams/" + streamer + "?callback=?";
      checkStream(channelData, streamer);
    }
  });
};

//EVENTS ------//
$(document).ready(function() {
  buildStreamerList(streamers);
});

$(".sel-status div").click(function() {
  $(".sel-status div").removeClass('selected');
  if ($(this).hasClass('all')) {
    $(this).addClass('selected');
    $(".list-streamers li").show();
  } else if ($(this).hasClass('online')) {
    $(this).addClass('selected');
    $(".list-streamers li.online").show();
    $(".list-streamers li.offline").hide();
  } else {
    $(this).addClass('selected');
    $(".list-streamers li.online").hide();
    $(".list-streamers li.offline").show();
  }
});
