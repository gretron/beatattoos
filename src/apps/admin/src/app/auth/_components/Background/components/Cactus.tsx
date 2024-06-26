import React, { useMemo, useRef } from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Color, Mesh, Vector3 } from "three";
import { TwoToneShaderUniforms } from "~/app/auth/_components/Background/shaders/TwoToneShader";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

export function Cactus(props: any) {
  const { nodes, materials } = useGLTF("/models/cactus.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.8,
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
          geometry={(nodes["Cactus002"] as Mesh).geometry}
          scale={3}
          rotation={[1, 0, 0]}
        >
          <TwoToneOutline thickness={0.01} uniforms={uniforms} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/cactus.glb");
