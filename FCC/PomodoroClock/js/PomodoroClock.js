//REVEALING MODULE PATTERN
var PomodoroClock = (function () {

  // Properties
  ///////////////////////////
  //UI hooks
  //inputs
  var sessionInput = document.querySelector("#session");
  var minutesInputVal = sessionInput.valueAsNumber;
  var breakInput = document.querySelector("#break");
  var breakInputVal = breakInput.valueAsNumber;

  //buttons
  var btnStart = document.querySelector("#btnStart");
  var btnStop = document.querySelector("#btnStop");
  var btnStopAudio = document.querySelector(".fa-volume-off");
  var btnPlayAudioBtn = document.querySelector(".fa-volume-up");


  //audio
  var audioChimer = document.querySelector(".chimer");
  var audioChimerLong = document.querySelector(".long");
  var audioTicker = document.querySelector(".ticker");

  //display
  var timer = document.querySelector(".timer");

  //timer data and initilization
  var minutes = 25;
  var seconds = 60;
  var breakLength = 5;
  var intervalId = 0;
  var isOnBreak = false;

  // Private Methods
  ///////////////////////////
  var setStringZeroes = function (number){
    var strSecs = "";
    if (number < 10) strSecs = "0"+number;
    else strSecs = number.toString();
    return strSecs;
  };
  var startInterval = function () {
    //TODO: TERRIBLE. REFACTOR.
    if(isOnBreak === false) {
      startSound(audioChimer);
      startSound(audioTicker);
      minutesInputVal = sessionInput.valueAsNumber;
      minutes = --minutesInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);
    } else if (isOnBreak === true) {
      startSound(audioChimerLong);
      breakInputVal = breakInput.valueAsNumber;
      minutes = --breakInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);
    }
  };
  var stopInterval = function (intervalId) {
    clearInterval(intervalId);
    stopSound(audioTicker);
  };
  var countDown = function () {
    if(minutes >= 0){
      seconds--;
      setTimerText(minutes+":"+setStringZeroes(seconds)+" on break: "+isOnBreak);
      if(seconds === 0) {
        minutes--;
        seconds = 60;
      }
    } else {
      isOnBreak = !isOnBreak;
      stopInterval(intervalId);
      startInterval();
    }
  };
  var setTimerText = function(text) {
    timer.innerText = text;
  };
  var startSound = function (audioElem) {
    audioElem.play();
  };
  var stopSound = function (audioElem) {
    audioElem.pause();
  };

  // UI Events
  ///////////////////////////
  //TODO: REFACTOR TO USE ONE EVENT LISTENER
  btnStart.addEventListener("click", function(event){
    //singleton interval
    if(intervalId > 0) {
      stopInterval(intervalId);
    }
    //get current input value
    var currInputVal = sessionInput.valueAsNumber;
    startInterval();
  });
  btnStop.addEventListener("click", function(event){
    //get current input value
    var currInputVal = sessionInput.valueAsNumber;
    stopInterval(intervalId);
  });
  sessionInput.addEventListener("click", function(event){
    if(intervalId > 0) return;
    minutes = sessionInput.valueAsNumber;
    setTimerText(minutes+":00");
  });
  btnStopAudio.addEventListener("click", function(event){
    stopSound(audioTicker);
    stopSound(audioChimer);
    stopSound(audioChimerLong);
  });
  btnPlayAudioBtn.addEventListener("click", function(event){
    if(isOnBreak === false) {
      startSound(audioTicker);
    }
  });
  // Public Methods, must be exposed in return statement below
  ///////////////////////////

  // Init
  ///////////////////////////

  // Reveal public methods
  // return {
  //   publicMethod: publicMethod
  // };
})();
