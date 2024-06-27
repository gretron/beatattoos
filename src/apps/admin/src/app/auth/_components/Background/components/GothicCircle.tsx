import React, { useRef } from "react";
import { Float, useGLTF } from "@react-three/drei";
import three, { Mesh } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

interface GothicCircleProps {
  lightPosition: [number, number, number];
}

export default function GothicCircle(props: GothicCircleProps) {
  const ref = useRef<three.Mesh>(null);
  const { nodes, materials } = useGLTF("/models/gothic_circle.glb");

  return (
    <>
      <group {...props} dispose={null}>
        <Float
          speed={1}
          rotationIntensity={1}
          floatIntensity={1}
          floatingRange={[1, 2]}
        >
          <mesh
            ref={ref}
            castShadow
            receiveShadow
            geometry={(nodes["GothicCircle"] as Mesh)?.geometry}
            rotation={[2.4, 0, 0.8]}
            scale={1.2}
          >
            <TwoToneOutline lightPosition={props.lightPosition} />
          </mesh>
        </Float>
      </group>
    </>
  );
}

useGLTF.preload("/models/gothic_circle.glb");
