import {
  TwoToneShader,
  TwoToneShaderUniforms,
} from "~/app/auth/_components/Background/shaders/TwoToneShader";
import React, { useMemo } from "react";
import { Color, Vector3 } from "three";

const Outlines = React.lazy(() =>
  import("@react-three/drei").then((module) => {
    return { default: module.Outlines };
  }),
);

interface TwoToneOutlineProps {
  lightPosition: [number, number, number];
}

export default function TwoToneOutline(props: TwoToneOutlineProps) {
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
      <shaderMaterial
        attach={"material"}
        {...TwoToneShader}
        uniforms={uniforms}
        toneMapped={false}
      />
      <Outlines
        color={"#F05D23"}
        thickness={1}
        screenspace={true}
        angle={0}
        toneMapped={false}
      />
    </>
  );
}
