import React, { useMemo, useRef } from "react";
import { Float, useGLTF } from "@react-three/drei";
import { Color, Mesh, Vector3 } from "three";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";
import { TwoToneShaderUniforms } from "~/app/auth/_components/Background/shaders/TwoToneShader";

export function Skull(props: any) {
  const { nodes, materials } = useGLTF("/models/skull.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.7,
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
          geometry={(nodes["Skull"] as Mesh).geometry}
          scale={2}
          rotation={[0, 3, 0.5]}
        >
          <TwoToneOutline thickness={0.01} uniforms={uniforms} />
        </mesh>
      </Float>
    </group>
  );
}

useGLTF.preload("/models/skull.glb");
