const audioContext = new window.AudioContext();

const analyser = audioContext.createAnalyser();
const gain = audioContext.createGain();
analyser.fftSize = 1024;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

export { audioContext, analyser, gain, bufferLength, dataArray };
