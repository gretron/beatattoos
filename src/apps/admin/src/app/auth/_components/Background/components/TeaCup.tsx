import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";
import { MeshoptDecoder } from "meshoptimizer";

interface TeaCupProps {
  lightPosition: [number, number, number];
}

/**
 * Tea cup 3D model
 */
export function TeaCup(props: TeaCupProps) {
  const { nodes, materials } = useGLTF(
    "/models/tea_cup.glb",
    undefined,
    true,
    (loader) => {
      loader.setMeshoptDecoder(MeshoptDecoder);
    },
  );

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
          geometry={(nodes["TeaCup"] as Mesh).geometry}
          position={[0, -1, 0]}
          scale={1.5}
          rotation={[0, 3.7, 0]}
        >
          <TwoToneOutline lightPosition={props.lightPosition} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/tea_cup.glb");
