import { useEffect, useState } from "react";

export default function useProgress(audioRef: HTMLAudioElement) {
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const updateCurrentTime: GlobalEventHandlers["ontimeupdate"] = () => {
    setCurrentTime(audioRef.currentTime);
  };

  const updateDuration: GlobalEventHandlers["onloadedmetadata"] = () => {
    setDuration(audioRef.duration);
  };

  const handleChangeCurrentTime = (time: number) => {
    audioRef.currentTime = time;
  };

  useEffect(() => {
    audioRef.addEventListener("timeupdate", updateCurrentTime);
    audioRef.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audioRef.removeEventListener("timeupdate", updateCurrentTime);
      audioRef.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef]);

  return { currentTime, duration, handleChangeCurrentTime };
}
