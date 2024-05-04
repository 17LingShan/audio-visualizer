import { makeAutoObservable, toJS } from "mobx";

export class SourceState {
  isPlaying: boolean = false;
  audioRef: HTMLAudioElement | null = null;
  audioBuffer: AudioBuffer | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setRef = (ref: HTMLAudioElement) => {
    this.audioRef = ref;
  };

  setAudioBuffer = (buffer: AudioBuffer) => {
    this.audioBuffer = buffer;
  };

  resume = (audioContext: AudioContext) => {
    if (audioContext.state !== "suspended") return;
    audioContext.resume();
  };

  play = (audioContext: AudioContext) => {
    this.resume(audioContext);
    this.audioRef?.play().then(() => (this.isPlaying = true));
  };

  pause = (audioContext: AudioContext) => {
    this.resume(audioContext);
    this.audioRef?.pause();
    this.isPlaying = false;
  };

  decodeAudio = (audioContext: AudioContext) => {
    if (!this.audioRef) return;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", toJS(this.audioRef.src), true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      audioContext.decodeAudioData(
        xhr.response,
        (buffer) => this.setAudioBuffer(buffer),
        (error) => console.log("xhr error", error)
      );
    };
    xhr.send();
  };
}

const SourceStateStore = new SourceState();
export default SourceStateStore;
