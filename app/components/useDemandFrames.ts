"use client";

import { useCallback, useEffect, useRef } from "react";
import type { RootState } from "@react-three/fiber";

// Drives a frameloop="demand" canvas: renders for a budget of frames after
// anything that could change the image, then stops. A paused canvas keeps its
// last frame on screen, so the scene stays visible at zero GPU cost.
//
// Two details this depends on:
//
// 1. The loop lives OUTSIDE the canvas. A driver rendered as a <Canvas> child
//    never starts: drei's <Text> suspends while its font loads, so sibling
//    effects don't commit, and with frameloop="demand" no first frame is ever
//    requested to resolve the deadlock. onCreated fires as soon as the
//    renderer exists, independent of children suspending.
//
// 2. The budget counts FRAMES, not wall-clock time. A tab opened in the
//    background has requestAnimationFrame suspended, so a time-based window
//    would expire before a single frame drew and the canvas would stay blank.
export function useDemandFrames(frameBudget = 240) {
  const invalidateRef = useRef<(() => void) | null>(null);
  const rearmRef = useRef<(() => void) | null>(null);

  const onCreated = useCallback((state: RootState) => {
    invalidateRef.current = state.invalidate;
    // Paint immediately, and give the scene a fresh budget now that it can
    // actually render — the font may still have been loading until this point.
    rearmRef.current?.();
    state.invalidate();
  }, []);

  useEffect(() => {
    let framesLeft = frameBudget;
    let raf: number;

    const wake = () => {
      framesLeft = frameBudget;
    };
    rearmRef.current = wake;

    const loop = () => {
      if (framesLeft > 0) {
        framesLeft--;
        invalidateRef.current?.();
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("touchmove", wake, { passive: true });
    window.addEventListener("resize", wake);
    window.addEventListener("focus", wake);
    document.addEventListener("visibilitychange", wake);
    raf = requestAnimationFrame(loop);

    return () => {
      rearmRef.current = null;
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("touchmove", wake);
      window.removeEventListener("resize", wake);
      window.removeEventListener("focus", wake);
      document.removeEventListener("visibilitychange", wake);
      cancelAnimationFrame(raf);
    };
  }, [frameBudget]);

  return onCreated;
}
