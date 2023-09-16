const ctx = shadowCanvas.getContext('2d');
let onShot = false;
let onShotPart = false;

inputVideo.addEventListener('change', (event) => {
  let fileList = inputVideo.files;
  if (fileList.length == 0) {
    return;
  }
  if (srcVideo.src != '') {
    window.URL.revokeObjectURL(srcVideo.src);
  }
  srcVideo.src = URL.createObjectURL(fileList[0]);
});

srcVideo.addEventListener('loadedmetadata', (event) => {
  let h = srcVideo.videoHeight;
  let w = srcVideo.videoWidth;
  shadowCanvas.width = w;
  shadowCanvas.height = h;
});

srcVideo.addEventListener('play', (event) => {
  window.requestAnimationFrame(shot);
});

function shot() {
 if(!srcVideo.paused) {
   if (onShot) {
     ctx.drawImage(srcVideo,0,0);
   }
   window.requestAnimationFrame(shot);
 }
}

const stream = shadowCanvas.captureStream();
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

let chunks = [];
recorder.ondataavailable = function(event) {
  chunks.push(event.data);
};

recorder.onstop = function() {
  if (destVideo.src != '') {
    URL.revokeObjectURL(destVideo.src);
  }
  const url = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
  destVideo.src = url;
};

recordPart.addEventListener('click', (event) => {
  // if (onShot == false) return;
  onShotPart = (onShotPart == false);
  if (onShotPart) recorder.pause(); else recorder.resume();
  recordPart.innerText = onShotPart ? 'Record Resume' : 'Record Pause';
});

record.addEventListener('click', (event) => {
  if (srcVideo.paused && onShot == false) {
    srcVideo.play();
  }
  if (onShot == false) {
    chunks = [];
    recorder.start();
  }
  if (onShot == true) {
    srcVideo.pause();
    recorder.stop();
  }
  record.innerText = onShot ? 'Record Start' : 'Recodrd Stop';
  onShot = (onShot == false);
});


reset.addEventListener('click', function(e) {
  chunks = [];
  URL.revokeObjectURL(destVideo.src);
  destVideo.src = ''
});
download.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = destVideo.src;
  a.download = 'shorten.webm';
  a.click();
  a.remove();
});
