const audioContext = new window.AudioContext();

const analyser = audioContext.createAnalyser();
analyser.fftSize = 1024;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

export { audioContext, analyser, bufferLength, dataArray };
