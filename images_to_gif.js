let ag = new Animated_GIF(agInitConfig());
let imgs = [];

let dpf = 1000; // delay time per frame, dpf = (1/fps)*1000
let scale = 0.5; // scale origin frame
let speed = 1;

paramFPS.addEventListener('change', (e) => dpf = 1/parseFloat(paramFPS.value) * 1000);
paramScale.addEventListener('change', (e) => scale = parseFloat(paramScale.value));
paramSpeed.addEventListener('change', (e) => speed = parseFloat(paramSpeed.value));

function addImage(file) {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.classList.add('box-preview-item');
  // image.style = 'display:none;';
  imgs.push(image);
  previewImgs.append(image);
}

inputImg.addEventListener('change', (event) => {
  let fList = inputImg.files;
  if (fList.length == 0) {
    for (let img of imgs) {
      URL.revokeObjectURL(img.src);
    }
    imgs = [];
    previewImgs.innerHTML = '';
    return;
  }
  for (let f of fList) {
    addImage(f);
  }
});

getGIF.addEventListener('click', getGIFNow);
reset.addEventListener('click', resetGIF);

function getGIFNow() {
  if (imgs.length == 0) return;
  destGIF.classList.add('loading');
  agInit();
  for (let img of imgs) {
    agShot(img);
  }
  ag.getBlobGIF(function(blob) {
    destGIF.src = URL.createObjectURL(blob);
    destGIF.classList.remove('loading');
  });
}

function agInit() {
  let w = Math.round(imgs[0].naturalWidth * scale);
  let h = Math.round(imgs[0].naturalHeight * scale);
  ag.setSize(w, h);
  destGIF.width = w;
  destGIF.height = h;
  //  0 = loop forever
  //  null = not looping
  //  n > 0 = loop n times and stop
  let repeat = paramRepeat.value;
  ag.setRepeat(repeat == '' ? null : parseInt(repeat));
}

function agInitConfig() {
  return {
    sampleInterval: parseInt(paramSampleInterval.value),
    numWorkers: 4,
  };
}

function agShot(img) {
  ag.addFrame(img, {delay: Math.round(dpf / speed)});
}

function resetGIF() {
  ag.destroy();
  ag = new Animated_GIF(agInitConfig());
  URL.revokeObjectURL(destGIF.src);
  destGIF.src = '';
}

download.addEventListener('click', (event) => {
  if (destGIF.src == '') return;
  const a = document.createElement('a');
  a.href = destGIF.src;
  a.download = 'download.gif';
  a.click();
  a.remove();
});
