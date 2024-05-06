import styles from "./index.module.scss";
import { CSSProperties, MouseEventHandler, useEffect, useRef } from "react";
import useProgress from "@/hooks/useProgress";
import { GraphThemeProps } from "@/store/type";
import { getProgressXByDuration, getTimeByWidth } from "@/utils/common";

interface WaveGraphProp {
  audioContext: AudioContext;
  audioRef: HTMLAudioElement;
  audioBuffer: AudioBuffer | null;
  theme: GraphThemeProps;
  wrapStyle?: CSSProperties;
}

function WaveGraph(props: WaveGraphProp) {
  const { audioBuffer, theme, audioRef, wrapStyle } = props;
  const { duration, currentTime, handleChangeCurrentTime } =
    useProgress(audioRef);

  const wrapRef = useRef<HTMLDivElement>(null);

  const waveRef = useRef<HTMLCanvasElement>(null);
  const waveContext = useRef<CanvasRenderingContext2D>();

  const progressRef = useRef<HTMLCanvasElement>(null);
  const progressContext = useRef<CanvasRenderingContext2D>();

  const drawWave = () => {
    const wrap = wrapRef.current!;
    const waveCanvasCtx = waveContext.current!;

    waveCanvasCtx.fillStyle = theme.graphBackground as string;
    waveCanvasCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    if (!audioBuffer) return;

    // 1为单声道 2为双声道
    const originData = audioBuffer.getChannelData(0);
    const originStep = Math.floor(originData.length / wrap.clientWidth);
    // 声波图采样展示数据: positives为上方, negatives为下方
    const positives: number[] = [],
      negatives: number[] = [];

    for (let i = 0; i < originData.length; i += originStep) {
      let maxNum = -Infinity,
        minNum = Infinity;
      for (let j = 0; j < originStep; j++) {
        const data = originData[j + i];
        if (data > maxNum) maxNum = data;
        if (data < minNum) minNum = data;
      }
      positives.push(maxNum);
      negatives.push(minNum);
    }

    let x = 0,
      y = theme.graphHeight >>> 1;
    waveCanvasCtx.fillStyle = "#cc34eb";
    waveCanvasCtx.beginPath();
    waveCanvasCtx.moveTo(x, y);

    for (let i = 0; i < positives.length; i++) {
      waveCanvasCtx.lineTo(x + i, y * (1 - positives[i]));
    }

    for (let i = negatives.length - 1; i >= 0; i--) {
      waveCanvasCtx.lineTo(x + i, y * (1 + Math.abs(negatives[i])));
    }

    waveCanvasCtx.fill();
  };

  const drawProgressbar = () => {
    const wrap = wrapRef.current!;
    const progressCtx = progressContext.current!;

    // 父元素内x的坐标
    const x = getProgressXByDuration(currentTime, wrap.clientWidth, duration);
    // 清除之前画的线条
    progressCtx.clearRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    progressCtx.beginPath();
    progressCtx.lineWidth = 2;
    progressCtx.strokeStyle = "#61e461";

    progressCtx.moveTo(x, 0);
    progressCtx.lineTo(x, theme.graphHeight);
    progressCtx.stroke();
  };

  const handleProgressClick: MouseEventHandler = (e) => {
    if (!wrapRef.current || !audioRef.src) return;
    const wrap = wrapRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = getTimeByWidth(clickX, wrap.clientWidth, duration);
    handleChangeCurrentTime(time);
  };

  const initScale = () => {
    if (!wrapRef.current || !waveRef.current || !progressRef.current) return;

    waveRef.current.width = wrapRef.current.clientWidth;
    progressRef.current.width = wrapRef.current.clientWidth;
    waveRef.current.height = wrapRef.current.clientHeight;
    progressRef.current.height = wrapRef.current.clientHeight;
  };

  useEffect(() => {
    initScale();
    requestAnimationFrame(drawWave);
  }, [wrapStyle]);

  useEffect(() => {
    requestAnimationFrame(drawWave);
  }, [audioBuffer]);

  useEffect(() => {
    requestAnimationFrame(drawProgressbar);
  }, [currentTime]);

  useEffect(() => {
    if (!wrapRef.current || !waveRef.current || !progressRef.current) return;
    initScale();
    waveContext.current = waveRef.current.getContext("2d")!;
    progressContext.current = progressRef.current.getContext("2d")!;
  }, []);

  return (
    <div
      className={styles["wave-wrap"]}
      ref={wrapRef}
      style={{ height: theme.graphHeight, ...wrapStyle }}
    >
      <canvas className={styles["wave-canvas"]} ref={waveRef}></canvas>
      <canvas
        className={styles["progress-canvas"]}
        ref={progressRef}
        onClick={handleProgressClick}
      ></canvas>
    </div>
  );
}

export default WaveGraph;
