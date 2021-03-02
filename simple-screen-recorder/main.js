var captureStream;
var mediaRecorder;
var recordedChunks = [];
var doRecord = false;
const streamElem = document.getElementById("streamButton");
const recordElem = document.getElementById("recordButton");
const logElem = document.getElementById("log");

console.log = (msg) => (logElem.innerHTML += `${msg}<br>`);
console.error = (msg) =>
  (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = (msg) =>
  (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = (msg) =>
  (logElem.innerHTML += `<span class="info">${msg}</span><br>`);

function handleDataAvailable(event) {
  console.log("data-available");
  recordedChunks.push(event.data);
  console.log(recordedChunks);
}

async function startCapture(displayMediaOptions, mediaRecorderOptions) {
  captureStream = null;
  let result = true;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    mediaRecorder = new MediaRecorder(captureStream, mediaRecorderOptions);
    mediaRecorder.ondataavailable = handleDataAvailable;
    if (doRecord) mediaRecorder.start();
  } catch (err) {
    console.error("Error: " + err);
    captureStream = null;
    mediaRecorder = null;
    result = false;
  }
  return result;
}

function startStream() {
  return startCapture(
    {
      video: true,
      audio: true
    },
    {
      mimeType: "video/webm; codecs=vp9"
    }
  );
}

function startRecord() {
  recordedChunks = [];
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  doRecord = true;
}

function endRecord() {
  doRecord = false;
  mediaRecorder.stop();
}

function download(downloadOptions) {
  var blob = new Blob(recordedChunks, downloadOptions);
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "recording.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

function dumpOptionsInfo() {
  captureStream.getTracks().forEach((track) => {
    console.info("Track settings:");
    console.info(JSON.stringify(track.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(track.getConstraints(), null, 2));
  });
}

function streamButtonClick() {
  startStream();
}

function recordButtonClick() {
  if (mediaRecorder == null) {
    alert("You must select a screen to record first");
  } else {
    if (doRecord) {
      endRecord();
      recordElem.innerHTML = "Start Recording";
    } else {
      startRecord();
      recordElem.innerHTML = "End Recording";
    }
  }
}

function downloadButtonClick() {
  download({
    type: "video/webm"
  });
}
