import { debounce } from "@/utils/common";
import { useEffect } from "react";

interface ResizeOption {
  debounce?: number;
}

/**
 * @description 窗口大小改变的生命周期函数, 经过节流化
 * @param callback
 * @param deps
 */
export default function useReSize(
  callback: EventListener,
  deps?: React.DependencyList | undefined,
  resizeOption?: ResizeOption
) {
  useEffect(
    () => {
      let optionedCB = callback;
      if (resizeOption?.debounce && resizeOption.debounce > 0)
        optionedCB = debounce(callback, resizeOption!.debounce);

      window.addEventListener("resize", optionedCB);

      return () => {
        window.removeEventListener("resize", optionedCB);
      };
    },
    deps ? [...deps] : []
  );
}
