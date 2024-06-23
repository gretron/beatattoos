import React, { RefObject, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import three, { Color, Vector3 } from "three";
import {
  SingleToneShader,
  TwoToneShaderUniforms,
} from "~/app/auth/_components/Background/shaders/SingleToneShader";

interface GothicCircleProps {
  lightPosition: Vector3;
}

export function GothicCircle(props: GothicCircleProps) {
  const ref = useRef<three.Mesh>(null);
  const { nodes, materials } = useGLTF("/models/gothic_circle.glb");

  const uniforms = useMemo((): TwoToneShaderUniforms => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#3E3305")],
      },
      brightnessThreshold: {
        value: 0.2,
      },
      lightPosition: {
        value: props.lightPosition ?? new Vector3(),
      },
    };
  }, [props.lightPosition]);

  return (
    <>
      <group {...props} dispose={null}>
        <mesh
          ref={ref}
          castShadow
          receiveShadow
          scale={[0.1, 0.1, 0.1]}
          geometry={
            (nodes["uploads_files_3751083_gotic+1"] as three.Mesh)?.geometry
          }
        >
          <shaderMaterial
            attach={"material"}
            {...SingleToneShader}
            uniforms={uniforms}
            toneMapped={false}
            transparent={true}
          />
          {/*<meshToonMaterial color={"#3E3305"} toneMapped={false} />*/}
        </mesh>
      </group>
    </>
  );
}

useGLTF.preload("/gothic_circle.glb");
