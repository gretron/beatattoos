import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

interface BlackWidowProps {
  lightPosition: [number, number, number];
}

export function BlackWidow(props: BlackWidowProps) {
  const { nodes, materials } = useGLTF("/models/black_widow.glb");

  return (
    <group {...props} dispose={null}>
      <Float
        speed={1}
        rotationIntensity={1}
        floatIntensity={1}
        floatingRange={[1, 2]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes["BlackWidow"] as Mesh).geometry}
          material={materials["default"]}
          scale={2.5}
          position={[0, 1, 0]}
          rotation={[1.7, 5.3, -1]}
        >
          <TwoToneOutline lightPosition={props.lightPosition} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/black_widow.glb");
