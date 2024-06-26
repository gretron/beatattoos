import React, { useMemo } from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Color, Mesh, Vector3 } from "three";
import { TwoToneShaderUniforms } from "~/app/auth/_components/Background/shaders/TwoToneShader";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

export function TeaCup(props: any) {
  const { nodes, materials } = useGLTF("/models/tea_cup.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.5,
      },
      lightPosition: {
        value: props.lightPosition ?? new Vector3(),
      },
    };
  }, [props.lightPosition]);

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
          scale={1.5}
          rotation={[0, 3.5, 0]}
        >
          <TwoToneOutline thickness={0.01} uniforms={uniforms} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/tea_cup.glb");
