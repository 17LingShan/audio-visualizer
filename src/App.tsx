import { useLayoutEffect, useRef, useState } from "react";
import {
  audioContext,
  analyser,
  dataArray,
  bufferLength,
} from "./audio/audioContext";
import WaveGraph from "./components/WaveGraph";
import ControlGroup from "./components/ControlGroup";
import FrequencyGraph from "./components/FrequencyGraph";
import OscilloscopeGraph from "./components/OscilloscopeGraph";

export default function App() {
  const [isPlay, setIsPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = useRef<MediaElementAudioSourceNode>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const decodeAudio = async () => {
    if (!audioRef.current) return;

    const audioElement = audioRef.current;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", audioElement.src, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      audioContext.decodeAudioData(
        xhr.response,
        (buffer) => setAudioBuffer(buffer),
        (error) => console.log("xhr error", error)
      );
    };
    xhr.send();
  };

  useLayoutEffect(() => {
    if (track.current) return;
    track.current = audioContext.createMediaElementSource(audioRef.current!);
    track.current.connect(analyser).connect(audioContext.destination);
  }, []);

  return (
    <div>
      <div>
        <h2>something new</h2>
      </div>
      <ControlGroup
        audioContext={audioContext}
        audioRef={audioRef}
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        handleUploadedFinished={decodeAudio}
      />
      <div>
        <WaveGraph audioBuffer={audioBuffer} audioContext={audioContext} />
        <FrequencyGraph
          analyser={analyser}
          dataArray={dataArray}
          bufferLength={bufferLength}
        />
        <OscilloscopeGraph
          analyser={analyser}
          dataArray={dataArray}
          bufferLength={bufferLength}
        />
      </div>
      <audio onEnded={() => setIsPlay(false)} ref={audioRef}></audio>
    </div>
  );
}
