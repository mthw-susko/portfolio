// app/components/MarbleScene.tsx
"use client";

import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, PerformanceMonitor } from '@react-three/drei';

function GlassCube({ color, index, hoveredIndex, numCubes, ...props }: { color: string; index: number; hoveredIndex: number; numCubes: number; [key: string]: unknown }) {
  const materialProps = {
    thickness: 0.9,
    roughness: 0.2,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 1,
    backside: true,
    samples: 8,
    temporalDistortion: 0.4,
  };

  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  // Give each cube a unique, random rotation speed that persists
  const randomSpeeds = useRef({
    x: (Math.random() - 0.5) * 0.7,
    y: (Math.random() - 0.5) * 0.7,
  });
  
  // OPTIMIZATION: Create the target scale vector once and reuse it.
  const targetScaleVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // --- Add constant independent rotation ---
    meshRef.current.rotation.x += delta * randomSpeeds.current.x;
    meshRef.current.rotation.y += delta * randomSpeeds.current.y;

    const isHovered = hoveredIndex !== -1 && index === hoveredIndex % numCubes;

    // Animate scale
    const targetScale = isHovered ? 1.3 : 1;
    // OPTIMIZATION: Update the existing vector instead of creating a new one.
    targetScaleVec.set(targetScale, targetScale, targetScale);
    meshRef.current.scale.lerp(targetScaleVec, 0.1);

    // Animate light intensity
    if (lightRef.current) {
      const targetIntensity = isHovered ? 5.0 : 0.0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }
    
    // Spin the individual cube on hover on two axes
    if (isHovered) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.rotation.x += delta * 2;
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshTransmissionMaterial
        {...materialProps}
        color={color}
      />
      <pointLight ref={lightRef} color={color} distance={1} intensity={0} />
    </mesh>
  );
}

function Cubes({ hoveredIndex, hoverColor }: { hoveredIndex: number; hoverColor: string | null; }) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotationSpeed = 0.2;

  const colors = useMemo(() => ['#ff6b6b', '#f0e68c', '#87ceeb', '#98fb98', '#c792ea'], []);

  const positions = useMemo(() => {
    const radius = 2;
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * rotationSpeed;

      const { pointer } = state;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * Math.PI * 0.1, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * Math.PI * 0.1, 0.1);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.5, 0.5, 0]}>
      {positions.map((pos, i) => (
        <GlassCube
            key={i}
            index={i}
            hoveredIndex={hoveredIndex}
            numCubes={positions.length}
            color={hoverColor || colors[i]}
            position={pos}
        />
      ))}
    </group>
  );
}

export default function MarbleScene({ hoveredIndex, hoverColor }: { hoveredIndex: number; hoverColor: string | null; }) {
  // OPTIMIZATION: State to control Device Pixel Ratio for performance.
  const [dpr, setDpr] = useState(1.5);

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        <Canvas 
            gl={{ antialias: false, alpha: true }} // Disabling antialias can help, monitor will re-enable if performance allows
            camera={{ position: [0, 0, 15], fov: 25 }}
            dpr={dpr} // Control DPR based on performance
        >
            {/* OPTIMIZATION: This component will monitor performance and adjust DPR */}
            <PerformanceMonitor 
              onIncline={() => setDpr(2)} 
              onDecline={() => setDpr(1)}
            />

            <ambientLight intensity={Math.PI} />
            <spotLight position={[10, 10, 10]} intensity={Math.PI * 2} angle={0.3} penumbra={1} />
            <spotLight position={[-10, -10, 10]} intensity={Math.PI * 2} angle={0.3} penumbra={1} />
            
            <Cubes hoveredIndex={hoveredIndex} hoverColor={hoverColor}/>

            <Environment preset="sunset" />
        </Canvas>
    </div>
  );
}