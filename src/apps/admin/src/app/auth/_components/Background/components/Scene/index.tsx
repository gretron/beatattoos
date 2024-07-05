"use client";

import React, { Suspense, useRef, useState } from "react";
import three, { Vector3 } from "three";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Layout from "~/app/auth/_components/Background/components/Layout";

/**
 * Authentication background scene
 */
export default function Scene() {
  const lightRef = useRef<three.PointLight>(null);
  const [lightPosition, setLightPosition] = useState<Vector3>(
    new Vector3(5, 5, 20),
  );

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <OrbitControls minDistance={1} maxDistance={200} makeDefault />
        <pointLight
          position={lightPosition}
          ref={lightRef}
          color={"#ffffff"}
          castShadow
          intensity={3.1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <Layout lightPosition={lightPosition} />
        </Suspense>
      </Canvas>
    </>
  );
}
