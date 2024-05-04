import styles from "./styles.module.scss";
import commonStyles from "@/styles/common.module.scss";
import { ChangeEventHandler } from "react";
import useProgress from "@/hooks/useProgress";
import { audioContext } from "@/audio/audioContext";
import { formatSecondsAsMinutes } from "@/utils/common";

interface ControlGroupProps {
  isPlay: boolean;
  audioContext: AudioContext;
  audioRef: HTMLAudioElement;
  handleUploadedFinished?: (audioContext: AudioContext) => void;
  onPlay: (audioContext: AudioContext) => void;
  onPause: (audioContext: AudioContext) => void;
}

function ControlGroup(props: ControlGroupProps) {
  const { isPlay, onPause, onPlay, audioRef, handleUploadedFinished } = props;
  const { duration, currentTime } = useProgress(audioRef);

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files!;
    audioRef.src = URL.createObjectURL(file[0]);
    audioRef.load();
    handleUploadedFinished?.(audioContext);
  };

  const handlePlayClick = () => {
    if (!audioRef.src) {
      console.log("no audio resource inside!");
      return;
    }

    isPlay ? onPause(audioContext) : onPlay(audioContext);
  };

  return (
    <div className={styles["button-group"]}>
      <button className={commonStyles["old-button"]} onClick={handlePlayClick}>
        play/pause
      </button>
      <label htmlFor="audio-file" className={commonStyles["old-button"]}>
        upload mp3 file
        <input
          id="audio-file"
          type="file"
          className={styles["file-button"]}
          onChange={handleFileUpload}
          accept=".mp3"
        />
      </label>
      <button className={commonStyles["old-button"]}>
        {`${formatSecondsAsMinutes(currentTime)}/
        ${formatSecondsAsMinutes(duration)}`}
      </button>
    </div>
  );
}

export default ControlGroup;
