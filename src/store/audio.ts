import { makeAutoObservable, toJS } from "mobx";

export class SourceState {
  fileName: string = "";
  isLoop: boolean = false;
  isPlaying: boolean = false;
  audioRef: HTMLAudioElement | null = null;
  audioBuffer: AudioBuffer | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setRef(ref: HTMLAudioElement) {
    this.audioRef = ref;
  }

  setFileName(name: string) {
    this.fileName = name;
  }

  setAudioBuffer(buffer: AudioBuffer) {
    this.audioBuffer = buffer;
  }

  setIsPlaying(playing: boolean) {
    this.isPlaying = playing;
  }

  setIsLoop(loop: boolean) {
    this.isLoop = loop;
  }

  resume(audioContext: AudioContext) {
    if (audioContext.state !== "suspended") return;
    audioContext.resume();
  }

  play(audioContext: AudioContext, time?: number) {
    if (!this.audioRef) return;

    this.resume(audioContext);
    if (time) this.audioRef.currentTime = time;
    this.audioRef?.play().then(() => this.setIsPlaying(true));
  }

  pause(audioContext: AudioContext) {
    if (!this.audioRef) return;

    this.resume(audioContext);
    this.audioRef.pause();
    this.setIsPlaying(false);
  }

  decodeAudio(audioContext: AudioContext, files?: FileList) {
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

    if (!files) return;
    this.setFileName(files[0].name);
  }
}

const SourceStateStore = new SourceState();
export default SourceStateStore;
