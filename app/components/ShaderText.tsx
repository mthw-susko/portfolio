// app/components/ShaderText.tsx
"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  extend,
  createPortal,
  useThree,
} from "@react-three/fiber";
import {
  Text,
  shaderMaterial,
  useFBO,
  OrthographicCamera,
} from "@react-three/drei";

// Define the shader material with a new uniform for aberration strength
const SmearMaterial = shaderMaterial(
  // Uniforms
  {
    u_texture: new THREE.Texture(),
    u_mouse: new THREE.Vector2(0, 0),
    u_prevMouse: new THREE.Vector2(0, 0),
    u_strength: 0.5,
    u_radius: 0.15,
    u_aberrationStrength: 0.03, // Controls the intensity of the color separation
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader - updated to include chromatic aberration
  `
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_strength;
    uniform float u_radius;
    uniform float u_aberrationStrength; // New uniform
    varying vec2 vUv;

    void main() {
      vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
      vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

      vec2 mouseDirection = u_mouse - u_prevMouse;
      
      float pixelDistanceToMouse = length(centerOfPixel - u_mouse);
      float strength = smoothstep(u_radius, 0.0, pixelDistanceToMouse);

      vec2 uvOffset = strength * -mouseDirection * u_strength;
      vec2 uv = vUv + uvOffset;

      // Sample the texture three times with different offsets for R, G, and B channels
      vec4 colorR = texture2D(u_texture, uv - (mouseDirection * strength * u_aberrationStrength));
      vec4 colorG = texture2D(u_texture, uv);
      vec4 colorB = texture2D(u_texture, uv + (mouseDirection * strength * u_aberrationStrength));

      // Combine the channels to create the final color
      gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
    }
  `
);

extend({ SmearMaterial });

// The main scene component (no changes needed here)
function Scene({
  children,
  fontSize,
  lineHeight,
  textAlign = "center",
}: {
  children: string;
  fontSize: number;
  lineHeight: number;
  textAlign?: "left" | "right" | "center" | "justify";
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const textScene = useMemo(() => new THREE.Scene(), []);
  const fbo = useFBO();
  const fontUrl = "/fonts/imperial-black.ttf";
  const { viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_prevMouse.value.lerp(
        materialRef.current.uniforms.u_mouse.value,
        0.02
      );
    }

    state.gl.setRenderTarget(fbo);
    state.gl.setClearColor('#0a0a0a', 0);
    state.gl.clear();
    state.gl.render(textScene, state.camera);
    state.gl.setRenderTarget(null);
  });

  const handlePointerMove = (e: { uv: THREE.Vector2; }) => {
    if (e.uv && materialRef.current) {
      materialRef.current.uniforms.u_mouse.value.copy(e.uv);
    }
  };

  return (
    <>
      {createPortal(
        <Text
          font={fontUrl}
          fontSize={fontSize}
          lineHeight={lineHeight}
          textAlign={textAlign}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {children}
        </Text>,
        textScene
      )}

      <mesh onPointerMove={handlePointerMove}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* @ts-expect-error: SmearMaterial is not a standard JSX element */}
        <smearMaterial ref={materialRef} u_texture={fbo.texture} />
      </mesh>
    </>
  );
}

// The wrapper component (no changes needed here)
interface ShaderTextProps {
  children: string;
  fontSize: number;
  height: string;
  lineHeight?: number;
  textAlign?: "left" | "right" | "center" | "justify";
}

export default function ShaderText({
  children,
  fontSize,
  height,
  lineHeight = 1,
  textAlign = "center",
}: ShaderTextProps) {
  return (
    <div style={{ height }} className="w-full">
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={50} />
        <Scene fontSize={fontSize} lineHeight={lineHeight} textAlign={textAlign}>
          {children}
        </Scene>
      </Canvas>
    </div>
  );
}
