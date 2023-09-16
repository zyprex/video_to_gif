const ctx = canvas.getContext('2d');
let onShot = false;
let shotImgDataList = [];

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
  canvas.width = w;
  canvas.height = h;
});

srcVideo.addEventListener('play', (event) => {
  window.requestAnimationFrame(shot);
});

function shot() {
  if (!srcVideo.paused) {
    if (onShot) {
      ctx.drawImage(srcVideo,0,0);
      saveImageData();
      recordRange.setAttribute('max', shotImgDataList.length);
      rangeValue.setAttribute('max', shotImgDataList.length);
      recordRange.value = shotImgDataList.length;
      rangeValue.value = shotImgDataList.length;
    }
    window.requestAnimationFrame(shot);
  }
}

record.addEventListener('click', (event) => {
  if (srcVideo.paused && onShot == false) {
    srcVideo.play();
  }
  if (onShot == true) {
    srcVideo.pause();
  }
  record.innerText = onShot ? 'Record Start' : 'Recodrd Stop';
  onShot = (onShot == false);
});

function saveImageData() {
  shotImgDataList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function loadImageData(i) {
  if (shotImgDataList.length > 0) {
    ctx.putImageData(shotImgDataList[i], 0, 0);
  }
}

clearImageData();
function clearImageData() {
  shotImgDataList = [];
  recordRange.value = 0;
  recordRange.setAttribute('max', 0);
  rangeValue.value = 0;
  rangeValue.setAttribute('max', 0);
}

reset.addEventListener('click', (event) => {
  clearImageData();
  ctx.clearRect(0,0,canvas.width,canvas.height);
});

recordRange.addEventListener('change', (event) => {
  rangeValue.value = recordRange.value;
  loadImageData(parseInt(recordRange.value));
});

rangeValue.addEventListener('change', (event) => {
  recordRange.value = rangeValue.value;
  loadImageData(parseInt(recordRange.value));
});

download.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg');
  a.download = `cull.jpg`;
  a.click();
  a.remove();
});
