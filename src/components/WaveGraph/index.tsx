import { useEffect, useRef } from "react";
import { graphHeight } from "@/configs/graph";

interface WaveGraphProp {
  audioContext: AudioContext;
  audioBuffer: AudioBuffer | null;
}

function WaveGraph(props: WaveGraphProp) {
  const { audioBuffer } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  // https://juejin.cn/post/6970558571700453390
  const drawWave = () => {
    if (!audioBuffer) return;

    const wrap = wrapRef.current!;
    const canvasCtx = canvasContext.current!;

    canvasCtx.fillStyle = "#c8c8c8";
    canvasCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    // 1为单声道 2为双声道
    const originData = audioBuffer.getChannelData(0);
    const originStep = Math.floor(originData.length / wrap.clientWidth);
    const positives: number[] = [],
      negatives: number[] = [];

    for (let i = 0; i < originData.length; i += originStep) {
      let maxNum = -Infinity,
        minNum = Infinity;
      for (let j = 0; j < originStep; j++) {
        maxNum = Math.max(maxNum, originData[j + i]);
        minNum = Math.min(minNum, originData[j + i]);
      }
      positives.push(maxNum);
      negatives.push(minNum);
    }

    let x = 0,
      y = graphHeight >>> 1;

    canvasCtx.fillStyle = "#cc34eb";
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

export default WaveGraph;
