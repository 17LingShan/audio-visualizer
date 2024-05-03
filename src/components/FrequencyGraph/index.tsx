import { graphHeight } from "@/configs/graph";
import { useEffect, useRef } from "react";

interface FrequencyGraphProp {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
}

export default function FrequencyGraph(props: FrequencyGraphProp) {
  const { analyser, dataArray, bufferLength } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  function drawFrequency() {
    requestAnimationFrame(drawFrequency);
    // 获取频率数据
    analyser.getByteFrequencyData(dataArray);

    const wrap = wrapRef.current!;
    const canvasCtx = canvasContext.current!;

    // 每次绘制都会初始化画布
    canvasCtx.fillStyle = "#c8c8c8";
    canvasCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    // 每个能量条可操作的宽度
    const barTotalWidth = wrap.clientWidth / bufferLength;
    // 柱形显示的宽度
    const marginHor = barTotalWidth * 0.1;
    // 柱形显示的宽度
    const barWidth = barTotalWidth - marginHor * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const vertical = dataArray[i] / 256;
      const barHeight = vertical * wrap.clientHeight;

      const gradient = canvasCtx.createLinearGradient(
        x + marginHor,
        0,
        x + marginHor,
        barHeight
      );

      gradient.addColorStop(1, "#00ff00");
      gradient.addColorStop(0.5, "#ffff00");
      gradient.addColorStop(0, "#ff0000");
      canvasCtx.fillStyle = gradient;

      canvasCtx.fillRect(
        x + marginHor,
        wrap.clientHeight - barHeight,
        barWidth,
        barHeight
      );

      // 向右平移一个可操作宽度
      x += barTotalWidth;
    }
  }

  useEffect(() => {
    if (!canvas.current || !wrapRef.current) return;
    canvasContext.current = canvas.current.getContext("2d")!;
    canvas.current.width = wrapRef.current.clientWidth;
    drawFrequency();
  }, []);

  return (
    <div ref={wrapRef}>
      <canvas height={graphHeight} ref={canvas}></canvas>
    </div>
  );
}
