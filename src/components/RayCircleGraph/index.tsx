import styles from "./index.module.scss";
import { CSSProperties, useEffect, useRef } from "react";
import type { GraphThemeProps } from "@/store/type";

interface CircleGraphProp {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
  theme: GraphThemeProps;
  radius?: number;
  wrapStyle?: CSSProperties;
}

export default function RayCircleGraph(props: CircleGraphProp) {
  const {
    analyser,
    dataArray,
    bufferLength,
    theme,
    radius = 25,
    wrapStyle,
  } = props;

  const wrapRef = useRef<HTMLDivElement>(null);

  const raysRef = useRef<HTMLCanvasElement>(null);
  const raysContextRef = useRef<CanvasRenderingContext2D>();

  const circleRef = useRef<HTMLCanvasElement>(null);
  const circleContextRef = useRef<CanvasRenderingContext2D>();

  const drawCircle = () => {
    const circle = circleRef.current!;
    const circleCtx = circleContextRef.current!;
    const x = circle.width >>> 1;
    const y = circle.height >>> 1;

    circleCtx.beginPath();
    circleCtx.arc(x, y, radius, 0, 2 * Math.PI);
    circleCtx.stroke();
  };

  const drawRays = () => {
    analyser.getByteFrequencyData(dataArray);

    // use low frequency data
    const LFDataArray = [
      ...dataArray.slice(0, dataArray.length >>> 1),
      ...dataArray.slice(0, dataArray.length >>> 1).reverse(),
    ];
    const rays = raysRef.current!;
    const raysCtx = raysContextRef.current!;

    raysCtx.fillStyle = theme.graphBackground as string;
    raysCtx.fillRect(0, 0, rays.clientWidth, rays.clientHeight);

    const initX = rays.width >>> 1;
    const initY = rays.height >>> 1;
    for (let i = 0; i < bufferLength; i++) {
      // [0,1]
      const vertical = LFDataArray[i] / 256;
      // [0, (容器最小内径 / 2) - 圆半径]
      let barHeight = vertical * (Math.min(initX, initY) - radius);

      const angle = ((i / bufferLength) * 2 + 1) * Math.PI;
      const x = initX - Math.sin(angle) * radius;
      const y = initY + Math.cos(angle) * radius;

      raysCtx.save();
      raysCtx.translate(x, y);
      raysCtx.rotate(angle);

      const gradient = raysCtx.createLinearGradient(
        0,
        0,
        bufferLength / 360,
        barHeight
      );

      gradient.addColorStop(0, "#00ff00");
      gradient.addColorStop(0.5, "#ffff00");
      gradient.addColorStop(1, "#ff0000");
      raysCtx.fillStyle = gradient;
      raysCtx.fillRect(0, 0, bufferLength / 360, barHeight);
      raysCtx.restore();
    }

    requestAnimationFrame(drawRays);
  };

  const initScale = () => {
    if (!wrapRef.current || !raysRef.current || !circleRef.current) return;
    console.log(123);
    raysRef.current.width = wrapRef.current.clientWidth;
    raysRef.current.height = wrapRef.current.clientHeight;
    circleRef.current.width = wrapRef.current.clientWidth;
    circleRef.current.height = wrapRef.current.clientHeight;
  };

  useEffect(() => {
    initScale();
    requestAnimationFrame(drawCircle);
  }, [wrapStyle]);

  useEffect(() => {
    if (!wrapRef.current || !raysRef.current || !circleRef.current) return;

    initScale();
    raysContextRef.current = raysRef.current.getContext("2d")!;
    circleContextRef.current = circleRef.current.getContext("2d")!;
    requestAnimationFrame(drawCircle);
    requestAnimationFrame(drawRays);
  }, []);

  return (
    <div
      className={styles["circle-wrap"]}
      style={{
        height: theme.graphHeight,
        ...wrapStyle,
      }}
      ref={wrapRef}
    >
      <canvas className={styles["rays-canvas"]} ref={raysRef}></canvas>
      <canvas className={styles["circle-canvas"]} ref={circleRef}></canvas>
    </div>
  );
}
