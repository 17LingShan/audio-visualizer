import { ChangeEventHandler, Dispatch, RefObject } from "react";
import styles from "./styles.module.scss";
import commonStyles from "@/styles/common.module.scss";

interface ControlGroupProps {
  isPlay: boolean;
  setIsPlay: Dispatch<React.SetStateAction<boolean>>;
  audioContext: AudioContext;
  audioRef: RefObject<HTMLAudioElement>;
  handleUploadedFinished?: () => void;
}

export default function ControlGroup(props: ControlGroupProps) {
  const { isPlay, setIsPlay, audioContext, audioRef, handleUploadedFinished } =
    props;

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files!;
    audioRef.current!.src = URL.createObjectURL(file[0]);
    audioRef.current?.load();
    handleUploadedFinished?.();
    handlePlay();
  };

  const handlePlayClick = () => {
    if (!audioRef.current?.src) {
      console.log("no audio resource inside!");
      return;
    }

    isPlay ? handlePause() : handlePlay();
  };

  const handlePlay = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioRef.current?.play();
    setIsPlay(true);
  };
  const handlePause = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioRef.current?.pause();
    setIsPlay(false);
  };

  return (
    <div className={styles["button-group"]}>
      <button className={commonStyles["old-button"]} onClick={handlePlayClick}>
        play/pause
      </button>
      <label htmlFor="file" className={commonStyles["old-button"]}>
        upload mp3 file
      </label>
      <input
        id="file"
        type="file"
        style={{
          display: "none",
        }}
        onChange={handleFileUpload}
        accept=".mp3"
      />
    </div>
  );
}
