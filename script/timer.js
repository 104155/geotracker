//Stopwatch
var startStopBtn = document.querySelector('.startStopBtn');
var resetBtn = document.querySelector('.resetBtn');
var displayTime = document.querySelector('.time');
var intervalTime;
var intervalGetPermission;
var startTime;
var stopTime;
var timeSpan;
var isRunning = false;

function startTimer() {
    intervalTime = setInterval(render, 1);

    if (timeSpan == undefined) {
        timeSpan = 0;
    }
    startTime = Date.now() - timeSpan;

    // startTime = Date.now();
    isRunning = true;
}

function stopTimer() {
    stopTime = startTime + update();
    clearInterval(intervalTime);
    intervalTime = null;
    isRunning = false;
}

function resetTimer() {
    startTime = 0;
    stopTime = 0;
    timeSpan = 0;
    clearInterval(intervalTime);
    intervalTime = null;
    isRunning = false;
    displayTime.innerHTML = "00:00:00:<span class='milli'>00</span>";
}

function update() {
    timeSpan = Date.now() - startTime;
    return timeSpan;
}

function timeSpanFormatterStrg(timeSpan) {

    let msHr = 3600000;
    let msMin = 60000;
    let msSec = 1000;
    let msRest;

    let hr;
    let min;
    let sec;
    let ms;

    hr = Math.floor(timeSpan / msHr);
    msRest = timeSpan % msHr;

    min = Math.floor(msRest / msMin);
    msRest = timeSpan % msMin;

    sec = Math.floor(msRest / msSec);

    ms = Math.floor((msRest % msSec) / 10);

    //hours to string
    if (hr <= 9) {
        strHr = `0${hr}`;
    } else {
        strHr = `${hr}`;
    }

    //minutes to string
    if (min <= 9) {
        strMin = `0${min}`;
    } else {
        strMin = `${min}`;
    }

    //seconds to string
    if (sec <= 9) {
        strSec = `0${sec}`;
    } else {
        strSec = `${sec}`;
    }

    //milliseconds to string
    if (ms < 10) {
        strMs = `0${ms}`;
    } else {
        strMs = `${ms}`;
    }

    return `${strHr}:${strMin}:${strSec}:<span class="milli">${strMs}</span>`;
}

function render() {
    displayTime.innerHTML = timeSpanFormatterStrg(update());
}

function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function addListeners() {
    startStopBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
}

addListeners();