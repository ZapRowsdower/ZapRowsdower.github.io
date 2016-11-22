//REVEALING MODULE PATTERN
var twitchTvKO = (function () {
  // Properties
  ///////////////////////////
  var streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
  twitchBaseUrl = "https://api.twitch.tv/kraken/",
  myViewModel = {
    streamerObjs: ko.observableArray(),
    streamFilterStatus: ko.observable('all'),
    setStreamFilterStatus: function (status) {
      this.streamFilterStatus(status);
    }
  };
  // Private Methods
  ///////////////////////////
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
        //add on the streamer status to the streamer data
        channelData.streamStatus = data.stream;
        //throw it in the view model
        myViewModel.streamerObjs.push(channelData);
      }
    });
  };
  var getChannel = function(streamer) {
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
        checkStream(channelData, streamer);
      }
    });
  };
  // Public Methods
  ///////////////////////////
  var buildStreamerList = function(streamers) {
    for (i = 0; i < streamers.length; i++) {
      getChannel(streamers[i]);
    }
  };

  var initKo = function (){
    ko.applyBindings(myViewModel);
  };

  // Reveal public methods and properties
  return {
    buildStreamerList: buildStreamerList,
    initKo: initKo,
    streamers: streamers
  };
})();
twitchTvKO.initKo();
twitchTvKO.buildStreamerList(twitchTvKO.streamers);
