"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import InvalidateOnActivity from "./InvalidateOnActivity";
import {
  getFluidHoverColor,
  subscribeFluidHoverColor,
} from "@/lib/hoverColorStore";

export default function FluidEffect() {
  // Tint the fluid with the hovered project's color; rainbow otherwise.
  const hoverColor = useSyncExternalStore(
    subscribeFluidHoverColor,
    getFluidHoverColor,
    () => null
  );

  return (
    <Canvas
      // The whole canvas is blurred 10px, so rendering at retina resolution is
      // wasted GPU work — dpr 1 looks identical and halves the fluid sim cost.
      dpr={1}
      // Only render while the pointer is active (see InvalidateOnActivity);
      // the fluid is mouse-driven, so idle frames are identical anyway.
      frameloop="demand"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: 1,
        pointerEvents: "none", // Allows clicking through the canvas
        filter: "blur(10px)", // Apply a slight blur to the entire canvas
      }}
    >
      <InvalidateOnActivity timeout={6000} />
      <EffectComposer>
        <Fluid
            radius={0.1}
            curl={10}
            swirl={5}
            distortion={2}
            force={0.9}
            pressure={0.5}
            densityDissipation={0.98}
            velocityDissipation={0.95}
            intensity={0.3}
            rainbow={hoverColor === null}
            blend={0}
            showBackground={true}
            backgroundColor='#000000'
            fluidColor={hoverColor ?? '#cfc0a8'}
        />
      </EffectComposer>
    </Canvas>
  );
}
