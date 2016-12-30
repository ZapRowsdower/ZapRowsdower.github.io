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
  var btnPause = document.querySelector("#btnPause");
  var btnStopAudio = document.querySelector(".fa-volume-up");
  var btnPlayAudioBtn = document.querySelector(".fa-volume-off");

  //audio
  var audioChimer = document.querySelector(".chimer");
  var audioChimerLong = document.querySelector(".long");
  var audioTicker = document.querySelector(".ticker");

  //display
  var timer = document.querySelector(".timer");
  var spinner = document.querySelector(".spinner");
  var cycleState = document.querySelector(".state.cycle");
  var audioState = document.querySelector(".state.audio");

  //timer data and initilization
  var minutes = 25;
  var seconds = 60;
  var breakLength = 5;
  var intervalId = 0;
  var isOnBreak = false;

  // UI Methods
  ///////////////////////////
  var setStringZeroes = function (number){
    var strSecs = "";
    if (number < 10) strSecs = "0"+number;
    else strSecs = number.toString();
    return strSecs;
  };
  var setSpinnerDuration = function (time) {
    var timeInSecs = time * seconds;
    spinner.style.animationDuration = timeInSecs+"s";
  };
  var startSpinnerAnim = function () {
    if(isOnBreak === false) {
      spinner.classList.add("animate-normal");
      spinner.classList.remove("animate-reverse");
    } else  {
      spinner.classList.add("animate-reverse");
      spinner.classList.remove("animate-normal");
    }
    spinner.classList.add("radar");
  };
  var stopSpinnerAnim = function () {
    //NOTE: setting animationPlayState is unreliable so removing animation class
    //to stop animation
    spinner.classList.remove("radar");
  };
  var pauseSpinnerAnim = function () {
    spinner.style.animationPlayState = "paused";
  };
  var setElemText = function(el, text) {
    el.innerText = text;
  };
  var startSound = function (audioElem) {
    audioElem.play();
  };
  var stopSound = function (audioElem) {
    audioElem.pause();
  };
  var toggleButtons = function (el, classAdd, classRemove, text) {
    el.classList.remove(classRemove);
    el.classList.add(classAdd);
    if(text) setElemText(text);
  };
  var toggleDisplay = function (clickedEl) {
    var otherEl = document.querySelector(clickedEl.dataset.other);
    clickedEl.style.display = "none";
    otherEl.style.display = "initial";
  };

  // Private Methods
  ///////////////////////////
  var startInterval = function () {
    //TODO: REFACTOR.
    if(isOnBreak === false) {
      minutesInputVal = sessionInput.valueAsNumber;
      setSpinnerDuration(minutesInputVal);
      startSpinnerAnim();
      minutes = --minutesInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);
      startSound(audioChimer);
      startSound(audioTicker);
    } else if (isOnBreak === true) {
      startSound(audioChimerLong);
      breakInputVal = breakInput.valueAsNumber;
      setSpinnerDuration(breakInputVal);
      startSpinnerAnim();
      minutes = --breakInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);
    }
  };
  var stopInterval = function (intervalId) {
    clearInterval(intervalId);
    stopSound(audioTicker);
    stopSpinnerAnim();
  };
  var countDown = function () {
    if(minutes >= 0){
      seconds--;
      setElemText(timer, minutes+":"+setStringZeroes(seconds));
      setElemText(cycleState, "Working");
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
  var resetTimer = function () {
    minutesInputVal = sessionInput.valueAsNumber;
    breakInputVal = breakInput.valueAsNumber;
    minutes = minutesInputVal;
    seconds = 60;
    breakLength = breakInputVal;
    intervalId = 0;
    isOnBreak = false;
  };

  // UI Events
  ///////////////////////////
  //TODO: REFACTOR TO USE ONE EVENT LISTENER
  btnStart.addEventListener("click", function(event){
    toggleDisplay(this);
    //singleton interval
    if(intervalId > 0) {
      stopInterval(intervalId);
    }
    startInterval();
  });
  btnStop.addEventListener("click", function(event){
    toggleDisplay(this);
    stopInterval(intervalId);
    resetTimer();
    setElemText(timer, minutes+":00");
    //TODO: update UI
  });
  sessionInput.addEventListener("click", function(event){
    if(intervalId > 0) return;
    minutes = sessionInput.valueAsNumber;
    setElemText(timer, minutes+":00");
  });
  btnStopAudio.addEventListener("click", function(event){
    stopSound(audioTicker);
    stopSound(audioChimer);
    stopSound(audioChimerLong);
    toggleDisplay(this);
    setElemText(audioState, "Audio is Off");
    audioState.style.color = "rgba(255,255,255,255)";
    setTimeout(function () {audioState.style.color = "rgba(0,0,0,0)";},2000);
  });
  btnPlayAudioBtn.addEventListener("click", function(event){
    if(isOnBreak === false && intervalId > 0) {
      startSound(audioTicker);
    }
    toggleDisplay(this);
    setElemText(audioState, "Audio is On");
    audioState.style.color = "rgba(255,255,255,255)";
    setTimeout(function () {audioState.style.color = "rgba(0,0,0,0)";},2000);
  });
  spinner.addEventListener("animationend", function(event){
    stopSpinnerAnim();
  });
})();
