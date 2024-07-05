import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";
import { MeshoptDecoder } from "meshoptimizer";

/**
 * Props for {@link Skull}
 */
interface SkullProps {
  lightPosition: [number, number, number];
}

/**
 * Skull 3D model
 */
export function Skull(props: SkullProps) {
  const { nodes, materials } = useGLTF(
    "/models/skull.glb",
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
          geometry={(nodes["Skull"] as Mesh).geometry}
          scale={2}
          rotation={[0, 3, 0.5]}
        >
          <TwoToneOutline lightPosition={props.lightPosition} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/skull.glb");
