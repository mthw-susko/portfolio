"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

// Full-screen overlay shown on the first page load only. It lives in the root
// layout, which persists across client-side navigations, so it never reappears
// when moving between pages.
const MIN_VISIBLE_MS = 600;
const MAX_WAIT_MS = 10000;
const FADE_MS = 700;

export default function InitialLoader() {
  // Tracks three.js loaders (e.g. the marble scene's environment map).
  const { active } = useProgress();
  const [pageReady, setPageReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const windowLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    Promise.all([windowLoaded, document.fonts.ready]).then(() => {
      if (!cancelled) setPageReady(true);
    });

    const minTimer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const maxTimer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (hidden) return;
    if (!timedOut && !(pageReady && minElapsed && !active)) return;
    // Give the canvases a moment to draw their first frames before revealing.
    const settle = setTimeout(() => setHidden(true), 200);
    return () => clearTimeout(settle);
  }, [pageReady, minElapsed, active, timedOut, hidden]);

  useEffect(() => {
    if (!hidden) return;
    const remove = setTimeout(() => setRemoved(true), FADE_MS);
    return () => clearTimeout(remove);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!hidden}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)] transition-opacity duration-700 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin opacity-40"></div>
        <p className="font-imperial text-xs uppercase tracking-[0.4em] text-[var(--foreground)] opacity-50">
          Loading
        </p>
      </div>
    </div>
  );
}
