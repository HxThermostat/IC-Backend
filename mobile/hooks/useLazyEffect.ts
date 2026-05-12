import { useEffect, useRef } from "react";

export const useLazyEffect: typeof useEffect = (cb, deps) => {
  const initialRender = useRef(false);

  useEffect((...args) => {
    if (initialRender.current) {
      cb(...args);
    } else {
      initialRender.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
