import React from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";
import { MeshoptDecoder } from "meshoptimizer";

/**
 * Props for {@link FlowerProps}
 */
interface FlowerProps {
  lightPosition: [number, number, number];
}

/**
 * Flower 3D model
 */
export default function Flower(props: FlowerProps) {
  const { nodes, materials } = useGLTF(
    "/models/flower.glb",
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
          geometry={(nodes.Flower as Mesh).geometry}
          scale={3}
          position={[0, -1, 0]}
          rotation={[0, -1.75, 0]}
        >
          <TwoToneOutline lightPosition={props.lightPosition} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/flower.glb");
