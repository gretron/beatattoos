import React, { RefObject, Suspense, useMemo, useRef } from "react";
import { Float, Helper, Outlines, Sphere, useGLTF } from "@react-three/drei";
import three, { BoxHelper, Color, Mesh, Vector3 } from "three";
import {
  TwoToneShader,
  TwoToneShaderUniforms,
} from "~/app/auth/_components/Background/shaders/TwoToneShader";
import { useThree } from "@react-three/fiber";
import TwoToneOutline from "~/app/auth/_components/Background/components/TwoToneOutline";

/*
const TwoToneOutline = React.lazy(
  () => import("~/app/auth/_components/Background/components/TwoToneOutline"),
);
 */

interface GothicCircleProps {
  lightPosition: Vector3;
}

export default function GothicCircle(props: any) {
  const ref = useRef<three.Mesh>(null);
  const { nodes, materials } = useGLTF("/models/gothic_circle.glb");

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
            position={[0, 2, -4]}
            scale={1.2}
          >
            <TwoToneOutline thickness={0.01} uniforms={uniforms} />
          </mesh>
        </Float>
      </group>
    </>
  );
}

useGLTF.preload("/models/gothic_circle.glb");
