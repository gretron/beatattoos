import { TwoToneShader } from "~/app/auth/_components/Background/shaders/TwoToneShader";
import React from "react";

const Outlines = React.lazy(() =>
  import("@react-three/drei").then((module) => {
    return { default: module.Outlines };
  }),
);

export default function TwoToneOutline(props: any) {
  return (
    <>
      <shaderMaterial
        attach={"material"}
        {...TwoToneShader}
        uniforms={props.uniforms}
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
