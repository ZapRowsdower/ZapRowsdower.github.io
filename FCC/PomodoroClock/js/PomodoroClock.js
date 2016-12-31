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
  var isMuted = false;

  // UI Methods
  ///////////////////////////
  var setStringZeroes = function (number){
    var strSecs = "";
    if (number < 10) strSecs = "0"+number;
    else strSecs = number.toString();
    return strSecs;
  };
  var setSpinnerDuration = function (minuteInput) {
    var timeInSecs = 0;
    if(minuteInput > 0) {
      timeInSecs = minuteInput * seconds;
    } else {
      timeInSecs = seconds;
    }
    spinner.style.animationDuration = timeInSecs+"s";
  };
  var startSpinnerAnim = function () {
    spinner.classList.add("clock");
    if(isOnBreak === false) {
      spinner.classList.add("animate-normal");
      spinner.classList.remove("animate-reverse");
    } else {
      spinner.classList.add("animate-reverse");
      spinner.classList.remove("animate-normal");
    }
  };
  var stopSpinnerAnim = function () {
    //NOTE: setting animationPlayState is unreliable so removing animation class
    //to stop animation
    spinner.classList.remove("clock");
  };
  var restartAnim = function (el, animationClass) {
    //NOTE: Restarting anim. per: https://css-tricks.com/restart-css-animation/
    el.classList.remove(animationClass);
    void el.offsetWidth;
    startSpinnerAnim();
  };
  var pauseSpinnerAnim = function () {
    spinner.style.animationPlayState = "paused";
  };
  var setElemText = function(el, text) {
    el.innerText = text;
  };
  var startSound = function (audioElem) {
    if(isMuted === false) audioElem.play();
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
  var sanitizeInput = function (input) {
    var sanitize = input.valueAsNumber;
    if(isNaN(sanitize) || sanitize === 0) {
      input.value = 0;
    } else if (sanitize > 120) {
      input.value = 120;
    }
    else {
      sanitize = Math.round(sanitize);
      input.value = sanitize;
    }
  };
  var startInterval = function () {
    //TODO: REFACTOR.
    if(isOnBreak === false) {
      //get minutes from input
      minutesInputVal = sessionInput.valueAsNumber;

      //set animation properties based on input
      setSpinnerDuration(minutesInputVal);

      //set up interval
      minutes = --minutesInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);

      //play sounds
      startSound(audioChimer);
      startSound(audioTicker);
    } else if (isOnBreak === true) {
      //get minutes from input
      breakInputVal = breakInput.valueAsNumber;

      //set animation properties based on input
      setSpinnerDuration(breakInputVal);

      //set up interval
      minutes = --breakInputVal;
      intervalId = setInterval(function(){countDown();}, 1000);

      //play sounds
      startSound(audioChimerLong);
    }
    // startSpinnerAnim();
    restartAnim(spinner, "clock");
  };
  var stopInterval = function (intervalId) {
    clearInterval(intervalId);
    stopSound(audioTicker);
    stopSpinnerAnim();
  };
  var countDown = function () {
    isOnBreak === true ? setElemText(cycleState, "Break Time!") : setElemText(cycleState, "You're on the clock!");
    if(minutes >= 0){
      seconds--;
      setElemText(timer, minutes+":"+setStringZeroes(seconds));
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
  var resetTimerData = function () {
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
    sanitizeInput(sessionInput);
    sanitizeInput(breakInput);
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
    resetTimerData();
    setElemText(timer, minutes+":00");
  });
  sessionInput.addEventListener("input", function(event){
    sanitizeInput(this);
    if(intervalId > 0) return;
    minutes = sessionInput.valueAsNumber;
    setElemText(timer, minutes+":00");
  });
  breakInput.addEventListener("input", function(event){
    sanitizeInput(this);
    if(intervalId > 0) return;
  });
  btnStopAudio.addEventListener("click", function(event){
    isMuted = true;
    stopSound(audioTicker);
    stopSound(audioChimer);
    stopSound(audioChimerLong);
    toggleDisplay(this);
    setElemText(audioState, "Audio is Off");
    //TODO: move styling to a CSS class
    audioState.style.color = "rgba(255,255,255,255)";
    setTimeout(function () {audioState.style.color = "rgba(0,0,0,0)";},2000);
  });
  btnPlayAudioBtn.addEventListener("click", function(event){
    isMuted = false;
    if(isOnBreak === false && intervalId > 0) {
      startSound(audioTicker);
    }
    toggleDisplay(this);
    setElemText(audioState, "Audio is On");
    //TODO: move styling to a CSS class
    audioState.style.color = "rgba(255,255,255,255)";
    setTimeout(function () {audioState.style.color = "rgba(0,0,0,0)";},2000);
  });
  window.addEventListener("focus", function(event){
    //NOTE: due to 'animationend' events not firing when the user is away (in another tab or app),
    //reset the clock animation every time this application has focus.
    //Spinner animation was inaccurate if the user was away from the tab for an extended period.
    //Clunky and weird, but animations aren't processed by the browser when the user is away for (good)
    //performance reasons.
    setSpinnerDuration(minutes);
    restartAnim(spinner, "clock");
  });
})();
