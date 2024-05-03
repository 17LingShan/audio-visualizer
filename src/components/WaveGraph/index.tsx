import { useEffect, useRef } from "react";
import { graphHeight } from "@/configs/graph";

interface WaveGraphProp {
  audioContext: AudioContext;
  audioBuffer: AudioBuffer | null;
}

export default function WaveGraph(props: WaveGraphProp) {
  const { audioBuffer } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  // https://juejin.cn/post/6970558571700453390
  const drawWave = () => {
    if (!audioBuffer) return;
    console.log("audioBuffer", audioBuffer);

    const wrap = wrapRef.current!;
    const canvasCtx = canvasContext.current!;

    canvasCtx.fillStyle = "#c8c8c8";
    canvasCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    // 1为单声道 2为双声道
    const originData = audioBuffer.getChannelData(0);
    const originStep = Math.floor(originData.length / wrap.clientWidth);

    const positives = [],
      negatives = [];

    for (let i = 0; i < originStep; i++) {
      const temp = Array.from(
        originData.slice(i * originStep, (i + 1) * originStep)
      );
      positives.push(Math.max.apply(null, temp));
      negatives.push(Math.min.apply(null, temp));
    }

    let x = 0,
      y = graphHeight >>> 1;

    canvasCtx.fillStyle = "#fa541c";
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);

    for (let i = 0; i < positives.length; i++) {
      canvasCtx.lineTo(x + i, y * (1 - positives[i]));
    }

    for (let i = negatives.length - 1; i >= 0; i--) {
      canvasCtx.lineTo(x + i, y * (1 + Math.abs(negatives[i])));
    }

    canvasCtx.fill();
  };

  useEffect(() => {
    if (!audioBuffer) return;
    requestAnimationFrame(drawWave);
  }, [audioBuffer]);

  useEffect(() => {
    if (!wrapRef.current || !canvasRef.current) return;
    canvasRef.current.width = wrapRef.current.clientWidth;
    canvasContext.current = canvasRef.current.getContext("2d")!;
  }, []);

  return (
    <div ref={wrapRef}>
      <canvas height={graphHeight} ref={canvasRef}></canvas>
    </div>
  );
}
