import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";
import { MeshoptDecoder } from "meshoptimizer";

/**
 * Props for {@link LuckyCat}
 */
interface LuckyCatProps {
  lightPosition: [number, number, number];
}

/**
 * Lucky cat 3D model
 */
export function LuckyCat(props: LuckyCatProps) {
  const { nodes, materials } = useGLTF(
    "/models/lucky_cat.glb",
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
          geometry={(nodes["LuckyCat"] as Mesh).geometry}
          scale={2.5}
        >
          <TwoToneOutline lightPosition={props.lightPosition} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/lucky_cat.glb");
