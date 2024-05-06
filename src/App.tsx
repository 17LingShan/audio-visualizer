import styles from "./App.module.scss";
import { useLayoutEffect, useRef } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import {
  audioContext,
  analyser,
  dataArray,
  bufferLength,
  gain,
} from "./audio/audioContext";
import GraphThemeStore from "./store/graph";
import SourceStateStore from "./store/audio";
import WaveGraph from "./components/WaveGraph";
import ControlGroup from "./components/ControlGroup";
import RayCircleGraph from "./components/RayCircleGraph";
import FrequencyGraph from "./components/FrequencyGraph";
import OscilloscopeGraph from "./components/OscilloscopeGraph";

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = useRef<MediaElementAudioSourceNode>();

  const handleAudioEnded = () => {
    SourceStateStore.isLoop
      ? SourceStateStore.play(audioContext, 0)
      : SourceStateStore.pause(audioContext);
  };

  useLayoutEffect(() => {
    if (track.current || !audioRef.current) return;
    SourceStateStore.setRef(audioRef.current);
    track.current = audioContext.createMediaElementSource(audioRef.current);
    track.current
      .connect(analyser)
      .connect(gain)
      .connect(audioContext.destination);

    audioRef.current.addEventListener("canplay", () =>
      SourceStateStore.play(audioContext)
    );
  }, []);

  return (
    <div>
      <div className={styles["file-name-wrap"]}>
        <h2>{toJS(SourceStateStore.fileName) || `something new`}</h2>
      </div>
      {SourceStateStore.audioRef ? (
        <>
          <ControlGroup
            audioContext={audioContext}
            audioRef={SourceStateStore.audioRef}
            gainNode={gain}
            isPlay={SourceStateStore.isPlaying}
            onPlay={SourceStateStore.play}
            onPause={SourceStateStore.pause}
            handleCheckLoop={SourceStateStore.setIsLoop}
            handleUploadedFinished={SourceStateStore.decodeAudio}
          />
          <div className={styles["graph-group"]}>
            <WaveGraph
              audioRef={SourceStateStore.audioRef}
              audioBuffer={SourceStateStore.audioBuffer}
              audioContext={audioContext}
              theme={GraphThemeStore.getTheme}
            />
            <RayCircleGraph
              analyser={analyser}
              dataArray={dataArray}
              bufferLength={bufferLength}
              theme={GraphThemeStore.getTheme}
              wrapStyle={{ width: "300px", height: "300px" }}
            />
            <FrequencyGraph
              analyser={analyser}
              dataArray={dataArray}
              bufferLength={bufferLength}
              theme={GraphThemeStore.getTheme}
            />
            <OscilloscopeGraph
              analyser={analyser}
              dataArray={dataArray}
              bufferLength={bufferLength}
              theme={GraphThemeStore.getTheme}
            />
          </div>
        </>
      ) : null}
      <audio onEnded={handleAudioEnded} ref={audioRef}></audio>
    </div>
  );
}

export default observer(App);
