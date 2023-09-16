let ag = new Animated_GIF(agInitConfig());
let onGIF = false;
let interv = null;
let isFirst = true;
// let fps = 8; // fps = 1000/dpf
let dpf = 125; // delay time per frame, dpf = (1/fps)*1000
let scale = 0.5; // scale origin frame
let speed = 1;

paramFPS.addEventListener('change', (e) => dpf = 1/parseFloat(paramFPS.value) * 1000);
paramScale.addEventListener('change', (e) => scale = parseFloat(paramScale.value));
paramSpeed.addEventListener('change', (e) => speed = parseFloat(paramSpeed.value));

inputVideo.addEventListener('change', (event) => {
  let fileList = inputVideo.files;
  if (fileList.length == 0) {
    return;
  }
  if (srcVideo.src != '') {
    window.URL.revokeObjectURL(srcVideo.src);
  }
  srcVideo.src = URL.createObjectURL(fileList[0]);
  srcVideo.onloadedmetadata = function() {
    let w = Math.round(srcVideo.videoWidth * scale);
    let h = Math.round(srcVideo.videoHeight * scale);
    destGIF.width = w;
    destGIF.height = h;
  };
});

function agInit() {
  let w = Math.round(srcVideo.videoWidth * scale);
  let h = Math.round(srcVideo.videoHeight * scale);
  ag.setSize(w, h);
  //  0 = loop forever
  //  null = not looping
  //  n > 0 = loop n times and stop
  let repeat = paramRepeat.value;
  ag.setRepeat(repeat == '' ? null : parseInt(repeat));
}

function agInitConfig() {
  return {
    sampleInterval: parseInt(paramSampleInterval.value),
    numWorkers: 10,
  };
}

function agShot() {
  ag.addFrame(srcVideo, {delay: Math.round(dpf / speed)});
}

getGIF.addEventListener('click', (event) => {
  if (srcVideo.src == '') return;
  if (isFirst) {
    window.URL.revokeObjectURL(destGIF.src);
    agInit();
    isFirst = false;
  }
  if (srcVideo.paused && !onGIF) {
    srcVideo.play();
  }
  if (onGIF) {
    srcVideo.pause();
    clearInterval(interv);
    destGIF.classList.add('loading');
    /* ag.getBase64GIF(function(image) {
      destGIF.src = image;
      destGIF.classList.remove('loading');
    });*/
    ag.getBlobGIF(function(blob) {
      destGIF.src = URL.createObjectURL(blob);
      destGIF.classList.remove('loading');
    });
    isFirst = true;
  } else {
    interv = setInterval(agShot,dpf);
  }
  getGIF.innerText = onGIF ? 'GIF start' : 'GIF stop';
  onGIF = (onGIF == false);
});

download.addEventListener('click', (event) => {
  if (destGIF.src == '') return;
  const a = document.createElement('a');
  a.href = destGIF.src;
  a.download = 'download.gif';
  a.click();
  a.remove();
});

reset.addEventListener('click', (event) => {
  window.URL.revokeObjectURL(destGIF.src);
  destGIF.src = '';
  destGIF.classList.remove('loading');
  ag.destroy();
  ag = new Animated_GIF(agInitConfig());
});

