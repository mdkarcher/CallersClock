var clockHours = document.getElementById("clock-hours");
var clockMins = document.getElementById("clock-mins");
var clockAMPM = document.getElementById("clock-ampm");

var watchMins = document.getElementById("watch-mins");
var watchSecs = document.getElementById("watch-secs");
var watchTenths = document.getElementById("watch-tenths");
var watchTicking = false;
var watchClear = true;
var watchPauseElapsed = 0;
var watchStartTime;

var watchStartButton = document.getElementById("watch-start");
var watchOtherButton = document.getElementById("watch-other");
var watchPauseButton = document.getElementById("watch-pause");
var watchResumeButton = document.getElementById("watch-resume");
var watchResetButton = document.getElementById("watch-reset");

var bpmDisplay = document.getElementById("bpm-disp");
var bpmButton = document.getElementById("bpm-sample");
var bpmSampling = false;
var bpmBeatSampling = false; // Maybe don't need this
var bpmBeats = [];
var bpmPhraseSampling = false; // Maybe don't need this
var bpmStartTime;

var timesList = document.getElementById("times-list");
var timesClearButton = document.getElementById("times-clear");

var timer;

function sum(x) {
  return x.reduce((a, b) => a+b, 0);
}

function fmtTime() {
  let date = new Date;
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ampm = "am";
  if (hh >= 12) {
    ampm = "pm";
  }
  
  if (hh > 12) {
    hh = hh - 12;
  }
  if (hh == 0) {
    hh = 12;
  }
  
  mm = (mm < 10) ? "0" + mm : mm;
  
  return {hh:hh, mm:mm, ampm:ampm};
}

function fmtElapsed() {
  let elapsed = watchPauseElapsed + Date.now() - watchStartTime;
  let wMins = Math.floor(elapsed / (1000 * 60));
  let wSecs = Math.floor(elapsed / (1000)) % 60;
  wSecs = (wSecs < 10) ? "0" + wSecs : wSecs;
  let wTenths = Math.floor(elapsed / (100)) % 10;
  
  return {wMins:wMins, wSecs:wSecs, wTenths:wTenths};
}

function tick() {
  let now = fmtTime();
  
  clockHours.innerHTML = now.hh;
  clockMins.innerHTML = now.mm;
  clockAMPM.innerHTML = now.ampm;
  
  if (watchTicking) {
    watchTick();
  }
}

function watchTick() {
  let elapsed = fmtElapsed();
  
  watchMins.innerHTML = elapsed.wMins;
  watchSecs.innerHTML = elapsed.wSecs;
  watchTenths.innerHTML = elapsed.wTenths;
}

function startWatch() {
  watchStartTime = Date.now();
  watchPauseElapsed = 0;
  watchTicking = true;
  watchClear = false;
  watchStartButton.style.display = "none";
  watchOtherButton.style.display = "none";
  watchPauseButton.style.display = "inline";
  watchResetButton.style.display = "inline";
  
  let now = fmtTime();
  let timeStr = now.hh + ":" + now.mm + now.ampm;
  let newTime = document.createElement("li");
  newTime.textContent = timeStr;
  timesList.appendChild(newTime);
  timesClearButton.style.display = "inline";
}

function otherWatch() {
  let now = fmtTime();
  let timeStr = "*" + now.hh + ":" + now.mm + now.ampm;
  let newTime = document.createElement("li");
  newTime.textContent = timeStr;
  timesList.appendChild(newTime);
  timesClearButton.style.display = "inline";
}

function pauseWatch() {
  if (!watchClear && watchTicking) {
    watchTicking = false;
    watchPauseElapsed = watchPauseElapsed + Date.now() - watchStartTime;
  }
  watchPauseButton.style.display = "none";
  watchResumeButton.style.display = "inline";
  //watchResetButton.style.display = "inline";
}

function resumeWatch() {
  if (!watchClear && !watchTicking) {
    watchStartTime = Date.now();
    watchTicking = true;
  }
  watchResumeButton.style.display = "none";
  //watchResetButton.style.display = "none";
  watchPauseButton.style.display = "inline";
}

function resetWatch() {
  watchTicking = false;
  watchClear = true;
  watchPauseElapsed = 0;
  watchStartTime = Date.now();
  watchTick();
  watchPauseButton.style.display = "none";
  watchResumeButton.style.display = "none";
  watchResetButton.style.display = "none";
  watchStartButton.style.display = "inline";
  watchOtherButton.style.display = "inline";
}

function bpmSample() {
  if (!bpmSampling) {
    bpmSampling = true;
    bpmStartTime = Date.now();
    bpmBeats = [];
    bpmDisplay.innerHTML = "BPM"
  } else {
    let elapsed = (Date.now()-bpmStartTime) / 60000;
    if (elapsed < 4.0 / 160.0) {
      if (!bpmBeatSampling) {
        bpmBeatSampling = true;
        bpmBeats = [];
      }
      bpmBeats.push(elapsed);
      bpmStartTime = Date.now();
      let bpm = bpmBeats.length / sum(bpmBeats)
      bpmDisplay.innerHTML = bpm.toFixed(1)
    } else {
      if (bpmBeatSampling) {
        bpmBeatSampling = false;
        bpmSampling = true;
        bpmStartTime = Date.now();
        bpmBeats = [];
        bpmDisplay.innerHTML = "BPM"
      } else {
        bpmSampling = false;
        let bpm = 4 / elapsed
        while (bpm < 80) {
          bpm *= 2
        }
        bpmDisplay.innerHTML = bpm.toFixed(1)
      }
    } 
  }
}

function clearTimes() {
  timesList.innerHTML = "";
  timesClearButton.style.display = "none";
}

watchStartButton.addEventListener('pointerdown', startWatch);
watchOtherButton.addEventListener('pointerdown', otherWatch);
watchPauseButton.addEventListener('pointerdown', pauseWatch);
watchResumeButton.addEventListener('pointerdown', resumeWatch);
watchResetButton.addEventListener('pointerdown', resetWatch);

bpmButton.addEventListener('pointerdown', bpmSample);

timesClearButton.addEventListener('pointerdown', clearTimes);

timer = setInterval(tick, 100);
