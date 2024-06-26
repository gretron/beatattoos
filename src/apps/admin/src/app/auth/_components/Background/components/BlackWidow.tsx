import React, { useMemo, useRef } from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Color, Mesh, Vector3 } from "three";
import { TwoToneShaderUniforms } from "~/app/auth/_components/Background/shaders/TwoToneShader";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

interface BlackWidowProps {}

export function BlackWidow(props: any) {
  const { nodes, materials } = useGLTF("/models/black_widow.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.6,
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
          geometry={(nodes["BlackWidow"] as Mesh).geometry}
          material={materials["default"]}
          scale={2.5}
          rotation={[1.7, 5.3, -1]}
        >
          <TwoToneOutline thickness={0.01} uniforms={uniforms} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/black_widow.glb");
