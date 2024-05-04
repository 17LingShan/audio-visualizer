import { useEffect, useRef } from "react";
import { graphHeight } from "@/configs/graph";

interface OscilloscopeGraphProp {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
}

function OscilloscopeGraph(props: OscilloscopeGraphProp) {
  const { analyser, dataArray, bufferLength } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope);
    // 获取时域数据
    analyser.getByteTimeDomainData(dataArray);

    const wrap = wrapRef.current!;
    const canvasCtx = canvasContext.current!;

    // 每次绘制都会初始化画布
    canvasCtx.fillStyle = "#c8c8c8";
    canvasCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    // 线宽px
    canvasCtx.lineWidth = 3;

    canvasCtx.beginPath();

    const sliceWidth = (wrap.clientWidth * 1.0) / bufferLength;
    let x = 0;

    canvasCtx.strokeStyle = `rgb(66,196,48)`;

    for (let i = 0; i < bufferLength; i++) {
      /**
       * vertical代表点在画布的高度百分比位置[0,1]
       * 八位数据中数据范围为[0,255]
       */
      // 将 vertical 归一化到[0, 1]
      const vertical = dataArray[i] / 256;
      const y = vertical * wrap.clientHeight;

      i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      x += sliceWidth;
    }

    canvasCtx.lineTo(wrap.clientWidth, wrap.clientHeight / 2);
    canvasCtx.stroke();
  }

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;
    canvasContext.current = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = wrapRef.current.clientWidth;
    drawOscilloscope();
  }, []);

  return (
    <div ref={wrapRef}>
      <canvas height={graphHeight} ref={canvasRef}></canvas>
    </div>
  );
}

export default OscilloscopeGraph;
