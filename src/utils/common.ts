/**
 * @description 格式化歌曲的时间
 * @param {number} second 当前歌曲的秒数
 * @returns {string} 格式为00:00的字符串
 */
export function formatSecondsAsMinutes(second: number): string {
  const str = `${Math.floor(second / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(second % 60)
    .toString()
    .padStart(2, "0")}`;
  return str;
}

/**
 * @description 点击的位置映射到audio的进度
 * @param {number} relativeX 相对于父元素的x坐标
 * @param {number} wrapWidth 父元素的宽
 * @param {number} duration audio总时长
 * @returns {number} audio对应的时间戳
 */
export function getTimeByWidth(
  relativeX: number,
  wrapWidth: number,
  duration: number
): number {
  return (duration * relativeX) / wrapWidth;
}

/**
 * @description audio的进度映射到父元素内的x坐标
 * @param {number} time audio的进度
 * @param {number} wrapWidth 父元素的宽
 * @param {number} duration audio总时长
 * @returns {number} 父元素中的x坐标
 */
export function getProgressXByDuration(
  time: number,
  wrapWidth: number,
  duration: number
): number {
  return time * (wrapWidth / duration);
}

/**
 * @description 节流函数, 一段操作后只执行一次
 * @param callback
 * @param delay
 * @returns
 */
export function debounce<T extends Function>(callback: T, delay: number = 300) {
  let time: number | null = null;
  return (...args: any) => {
    if (time !== null) clearTimeout(time);
    time = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
}
