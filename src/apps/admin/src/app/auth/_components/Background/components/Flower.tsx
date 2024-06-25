import React, { useMemo, useRef } from "react";
import { Outlines, useGLTF } from "@react-three/drei";
import three, { Color, Vector3 } from "three";
import {
  SingleToneShader,
  TwoToneShaderUniforms,
} from "~/app/auth/_components/Background/shaders/SingleToneShader";

interface FlowerProps {
  position: Vector3 | [number, number, number];
  lightPosition: Vector3;
}

export function Flower(props: any) {
  const { nodes, materials } = useGLTF("/models/flower.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.4,
      },
      lightPosition: {
        value: props.lightPosition ?? new Vector3(),
      },
    };
  }, [props.lightPosition]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Flower as three.Mesh).geometry}
        material={(nodes.Flower as three.Mesh).material}
        scale={0.02}
      >
        <shaderMaterial
          attach={"material"}
          {...SingleToneShader}
          uniforms={uniforms}
          toneMapped={false}
        />
        <Outlines thickness={2} color={new Color("#F05D23")} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/flower.glb");
