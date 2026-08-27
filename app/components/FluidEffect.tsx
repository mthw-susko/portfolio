"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { useDemandFrames } from "./useDemandFrames";

export default function FluidEffect() {
  const onCreated = useDemandFrames(360);

  return (
    <Canvas
      // The whole canvas is blurred 10px, so rendering at retina resolution is
      // wasted GPU work — dpr 1 looks identical and halves the fluid sim cost.
      dpr={1}
      // Only render while the pointer is active (see useDemandFrames); the
      // fluid is mouse-driven, so idle frames are identical anyway.
      frameloop="demand"
      onCreated={onCreated}
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
            rainbow={true}
            blend={0}
            showBackground={true}
            backgroundColor='#000000'
            fluidColor='#cfc0a8'
        />
      </EffectComposer>
    </Canvas>
  );
}
