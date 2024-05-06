import { CSSProperties, useEffect, useRef } from "react";
import useReSize from "@/hooks/useResize";
import type { GraphThemeProps } from "@/store/type";

interface OscilloscopeGraphProp {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
  theme: GraphThemeProps;
  wrapStyle?: CSSProperties;
}

function OscilloscopeGraph(props: OscilloscopeGraphProp) {
  const { analyser, dataArray, bufferLength, theme, wrapStyle } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  function drawOscilloscope() {
    // 获取时域数据
    analyser.getByteTimeDomainData(dataArray);

    const canvas = canvasRef.current!;
    const canvasCtx = canvasContext.current!;

    // 每次绘制都会初始化画布
    canvasCtx.fillStyle = theme.graphBackground as string;
    canvasCtx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // 线宽px
    canvasCtx.lineWidth = 3;

    canvasCtx.beginPath();

    const sliceWidth = (canvas.clientWidth * 1.0) / bufferLength;
    let x = 0;

    canvasCtx.strokeStyle = `rgb(66,196,48)`;

    for (let i = 0; i < bufferLength; i++) {
      /**
       * vertical代表点在画布的高度百分比位置[0,1]
       * 八位数据中数据范围为[0,255]
       */
      // 将 vertical 归一化到[0, 1]
      const vertical = dataArray[i] / 256;
      const y = vertical * canvas.clientHeight;

      i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.clientWidth, canvas.clientHeight / 2);
    canvasCtx.stroke();

    requestAnimationFrame(drawOscilloscope);
  }

  const initScale = () => {
    if (!wrapRef.current || !canvasRef.current) return;

    canvasRef.current.width = wrapRef.current.clientWidth;
    canvasRef.current.height = wrapRef.current.clientHeight;
    requestAnimationFrame(drawOscilloscope);
  };

  useReSize(() => initScale(), [], { debounce: 300 });

  useEffect(() => {
    initScale();
  }, [wrapStyle]);

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;

    initScale();
    canvasContext.current = canvasRef.current.getContext("2d")!;
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        height: theme.graphHeight,
        ...wrapStyle,
      }}
    >
      <canvas height={theme.graphHeight} ref={canvasRef}></canvas>
    </div>
  );
}

export default OscilloscopeGraph;
