import { useLayoutEffect, useRef } from "react";
import { observer } from "mobx-react";
import {
  audioContext,
  analyser,
  dataArray,
  bufferLength,
} from "./audio/audioContext";
import SourceStateStore from "./store/audio";
import WaveGraph from "./components/WaveGraph";
import ControlGroup from "./components/ControlGroup";
import FrequencyGraph from "./components/FrequencyGraph";
import OscilloscopeGraph from "./components/OscilloscopeGraph";

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = useRef<MediaElementAudioSourceNode>();

  const handleAudioEnded = () => {
    SourceStateStore.pause(audioContext);
  };

  useLayoutEffect(() => {
    if (track.current || !audioRef.current) return;
    SourceStateStore.setRef(audioRef.current);
    track.current = audioContext.createMediaElementSource(audioRef.current);
    track.current.connect(analyser).connect(audioContext.destination);
  }, []);

  return (
    <div>
      <div>
        <h2>something new</h2>
      </div>
      <ControlGroup
        audioContext={audioContext}
        audioRef={SourceStateStore.audioRef}
        isPlay={SourceStateStore.isPlaying}
        onPlay={SourceStateStore.play}
        onPause={SourceStateStore.pause}
        handleUploadedFinished={SourceStateStore.decodeAudio}
      />
      <div>
        <WaveGraph
          audioBuffer={SourceStateStore.audioBuffer}
          audioContext={audioContext}
        />
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
      <audio onEnded={handleAudioEnded} ref={audioRef}></audio>
    </div>
  );
}

export default observer(App);
