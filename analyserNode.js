// create context, analyser and element of audio
const audioCtx = new window.AudioContext();
const analyser = audioCtx.createAnalyser();
const audioEle = document.querySelector("#audio");

let isPlaying = false;

const track = audioCtx.createMediaElementSource(audioEle);

track.connect(analyser).connect(audioCtx.destination);

// FFT快速傅里叶变换
// fftSize用于频域分析的FFT初始尺寸, 一定是2^n
const FFTSize = 1024;
analyser.fftSize = FFTSize;
// 该值为fftSize的一半, 一般用于可视化数据值的数量, 这里是1024
const bufferLength = analyser.frequencyBinCount;
const frequencyDataArray = new Uint8Array(bufferLength);
const oscilloscopeDataArray = new Uint8Array(bufferLength);

// 能量条初始化
const frequencyWrap = document.querySelector("#frequency-wrap");
const frequency = document.querySelector("#frequency");
const frequencyCtx = frequency.getContext("2d");
frequency.width = frequencyWrap.clientWidth; // canvas宽度和父元素宽度一致

// 绘制能量条
function drawFrequency() {
  requestAnimationFrame(drawFrequency);
  // 每次绘制都会初始化画布
  frequencyCtx.fillStyle = "#c8c8c8";
  frequencyCtx.fillRect(0, 0, frequency.width, frequency.height);

  // 获取频率数据
  analyser.getByteFrequencyData(frequencyDataArray);

  // 每个能量条可操作的宽度
  const barTotalWidth = frequency.width / bufferLength;
  // 柱形的左右px
  const marginHor = barTotalWidth * 0.1;
  // 柱形显示的宽度
  const barWidth = barTotalWidth - marginHor * 2;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const vertical = frequencyDataArray[i] / 256;
    const barHeight = vertical * frequency.height;

    const gradient = frequencyCtx.createLinearGradient(
      x + marginHor,
      0,
      x + marginHor,
      barHeight
    );

    gradient.addColorStop(1, "#00ff00");
    gradient.addColorStop(0.5, "#ffff00");
    gradient.addColorStop(0, "#ff0000");
    frequencyCtx.fillStyle = gradient;

    frequencyCtx.fillRect(
      x + marginHor,
      frequency.height - barHeight,
      barWidth,
      barHeight
    );

    // 向右平移一个可操作宽度
    x += barTotalWidth;
  }
}

drawFrequency();

// 示波器初始化
const oscilloscopeWrap = document.querySelector("#oscilloscope-wrap");
const oscilloscope = document.querySelector("#oscilloscope");
const oscilloscopeCtx = oscilloscope.getContext("2d");
oscilloscope.width = oscilloscopeWrap.clientWidth;

// 绘制示波器
function drawOscilloscope() {
  requestAnimationFrame(drawOscilloscope);
  analyser.getByteTimeDomainData(oscilloscopeDataArray);

  // 初始化画布
  oscilloscopeCtx.fillStyle = "#c8c8c8";
  oscilloscopeCtx.fillRect(0, 0, oscilloscope.width, oscilloscope.height);

  // 线宽px
  oscilloscopeCtx.lineWidth = 3;

  oscilloscopeCtx.beginPath();

  const sliceWidth = (oscilloscope.width * 1.0) / bufferLength;
  let x = 0;
  const r = 66,
    g = 196,
    b = 48;
  oscilloscopeCtx.strokeStyle = `rgb(${r},${g},${b})`;

  for (let i = 0; i < bufferLength; i++) {
    /**
     * vertical代表点在画布的高度百分比位置[0,1]
     * 八位数据中数据范围为[0,255]
     */
    // 将 vertical 归一化到[0, 1]
    const vertical = oscilloscopeDataArray[i] / 256;
    const y = vertical * oscilloscope.height;

    i === 0 ? oscilloscopeCtx.moveTo(x, y) : oscilloscopeCtx.lineTo(x, y);
    x += sliceWidth;
  }

  oscilloscopeCtx.lineTo(oscilloscope.width, oscilloscope.height / 2);
  oscilloscopeCtx.stroke();
}

drawOscilloscope();

const playBtn = document.querySelector("#play");

function handleClickPlay() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (isPlaying) {
    audioEle.pause();
    isPlaying = false;
  } else {
    audioEle.play();
    isPlaying = true;
  }
}

function handlePlayEnded() {
  isPlaying = false;
}

audioEle.addEventListener("ended", handlePlayEnded);
playBtn.addEventListener("click", handleClickPlay);
