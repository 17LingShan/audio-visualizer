import styles from "./index.module.scss";
import { useEffect, useRef } from "react";
import type { GraphThemeProps } from "@/store/type";

interface CircleGraphProp {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
  theme: GraphThemeProps;
  radius?: number;
}

export default function CircleGraph(props: CircleGraphProp) {
  const { analyser, dataArray, bufferLength, theme, radius = 50 } = props;

  const wrapRef = useRef<HTMLDivElement>(null);

  const barsRef = useRef<HTMLCanvasElement>(null);
  const barsContextRef = useRef<CanvasRenderingContext2D>();

  const circleRef = useRef<HTMLCanvasElement>(null);
  const circleContextRef = useRef<CanvasRenderingContext2D>();

  const drawCircle = () => {
    const circle = circleRef.current!;
    const circleCtx = circleContextRef.current!;
    const circleX = circle.width >>> 1;
    const circleY = circle.height >>> 1;
    circleCtx.beginPath();
    circleCtx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
    circleCtx.stroke();
  };

  const drawBars = () => {
    analyser.getByteFrequencyData(dataArray);

    const LFDataArray = [
      ...dataArray.slice(0, dataArray.length >>> 1),
      ...dataArray.slice(0, dataArray.length >>> 1).reverse(),
    ];
    const wrap = wrapRef.current!;
    const bars = barsRef.current!;
    const barsCtx = barsContextRef.current!;

    barsCtx.fillStyle = theme.graphBackground as string;
    barsCtx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);

    const circleX = bars.width >>> 1;
    const circleY = bars.height >>> 1;

    for (let i = 0; i < bufferLength; i++) {
      // [0,1]
      const vertical = LFDataArray[i] / 256;
      // [0, (容器高度-圆直径) / 2]
      let barHeight = vertical * ((wrap.clientHeight - 2 * radius) / 2);

      const angle = ((i / bufferLength) * 2 + 1) * Math.PI;
      const x = circleX - Math.sin(angle) * radius;
      const y = circleY + Math.cos(angle) * radius;

      barsCtx.save();
      barsCtx.translate(x, y);
      barsCtx.rotate(angle);

      const gradient = barsCtx.createLinearGradient(
        0,
        0,
        bufferLength / 360,
        barHeight
      );

      gradient.addColorStop(1, "#00ff00");
      gradient.addColorStop(0.5, "#ffff00");
      gradient.addColorStop(0, "#ff0000");
      barsCtx.fillStyle = gradient;
      barsCtx.fillRect(0, 0, bufferLength / 360, barHeight);
      barsCtx.restore();
    }

    requestAnimationFrame(drawBars);
  };

  useEffect(() => {
    if (!wrapRef.current || !barsRef.current || !circleRef.current) return;
    barsRef.current.width = wrapRef.current.clientWidth;
    barsContextRef.current = barsRef.current.getContext("2d")!;
    circleRef.current.width = wrapRef.current.clientWidth;
    circleContextRef.current = circleRef.current.getContext("2d")!;
    requestAnimationFrame(drawCircle);
    requestAnimationFrame(drawBars);
  }, []);

  return (
    <div
      className={styles["circle-wrap"]}
      ref={wrapRef}
      style={{ height: theme.graphHeight }}
    >
      <canvas
        className={styles["bars-canvas"]}
        height={theme.graphHeight}
        ref={barsRef}
      ></canvas>
      <canvas
        className={styles["circle-canvas"]}
        height={theme.graphHeight}
        ref={circleRef}
      ></canvas>
    </div>
  );
}
