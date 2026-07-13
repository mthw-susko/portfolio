"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Drives a frameloop="demand" canvas only while the pointer has moved
// recently. Once the effect has visibly settled the canvas stops rendering,
// keeping its last frame on screen at zero GPU cost.
export default function InvalidateOnActivity({ timeout = 6000 }: { timeout?: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let lastActivity = performance.now();
    let raf: number;

    const onActivity = () => {
      lastActivity = performance.now();
    };
    const loop = () => {
      if (performance.now() - lastActivity < timeout) invalidate();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onActivity);
    window.addEventListener("touchmove", onActivity);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("touchmove", onActivity);
      cancelAnimationFrame(raf);
    };
  }, [invalidate, timeout]);

  return null;
}
