import DreamSpot from "@/assets/DreamSpot.mp3";
import { useLayoutEffect, useRef } from "react";
import {
  audioContext,
  analyser,
  frequencyDataArray,
  oscilloscopeDataArray,
  bufferLength,
} from "./audio/audioContext";
import FrequencyGraph from "./components/FrequencyGraph";
import OscilloscopeGraph from "./components/OscilloscopeGraph";

let isPlaying = false;

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = useRef<MediaElementAudioSourceNode>();

  const handlePlayClick = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (isPlaying) {
      audioRef.current?.pause();
      isPlaying = false;
    } else {
      audioRef.current?.play();
      isPlaying = true;
    }
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
      <div>
        <FrequencyGraph
          analyser={analyser}
          dataArray={frequencyDataArray}
          bufferLength={bufferLength}
        />
        <OscilloscopeGraph
          analyser={analyser}
          dataArray={oscilloscopeDataArray}
          bufferLength={bufferLength}
        />
      </div>
      <audio
        onEnded={() => {
          isPlaying = false;
        }}
        ref={audioRef}
        src={DreamSpot}
      ></audio>

      <div>
        <button onClick={handlePlayClick}>play/pause</button>
      </div>
    </div>
  );
}
