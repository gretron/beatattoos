"use client";

import React, { Suspense, useRef, useState } from "react";
import three, { Vector3 } from "three";

const Flower = React.lazy(() => import("../Flower"));
const GothicCircle = React.lazy(() => import("../GothicCircle"));

import { OrbitControls, useAspect } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Box, Flex } from "@react-three/flex";
import { FlexItem } from "~/app/auth/_components/Background/components/FlexItem";
import { BlackWidow } from "~/app/auth/_components/Background/components/BlackWidow";
import { Skull } from "~/app/auth/_components/Background/components/Skull";
import { TeaCup } from "~/app/auth/_components/Background/components/TeaCup";
import { Cactus } from "~/app/auth/_components/Background/components/Cactus";
import { LuckyCat } from "~/app/auth/_components/Background/components/LuckyCat";

export function Layout(props: any) {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const [margin, setMargin] = useState<number>(2);

  return (
    <Flex
      flexDirection={"row"}
      flexWrap={"wrap"}
      position={[0, 0, 0]}
      size={[vpWidth, vpHeight, 0]}
      marginTop={2}
      centerAnchor
    >
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        margin={margin}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <BlackWidow lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 2 */}
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        margin={margin}
        justifyContent={"center"}
      >
        <GothicCircle lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 3 */}
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        margin={margin}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Skull lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 4 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        margin={margin}
        alignItems={"center"}
      >
        <Flower lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 5 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        margin={margin}
        alignItems={"center"}
        justifyContent={"flex-end"}
      >
        <TeaCup lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 6 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        margin={margin}
        alignItems={"flex-end"}
        justifyContent={"center"}
      >
        <LuckyCat lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 7 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        margin={margin}
        alignItems={"flex-end"}
        justifyContent={"center"}
      >
        <Cactus lightPosition={props.lightPosition} />
      </FlexItem>
    </Flex>
  );
}

export default function Scene() {
  const lightRef = useRef<three.PointLight>(null);
  const [lightPosition, setLightPosition] = useState<Vector3>(
    new Vector3(5, 5, 20),
  );

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <OrbitControls minDistance={1} maxDistance={200} makeDefault />
        <pointLight
          position={lightPosition}
          ref={lightRef}
          color={"#ffffff"}
          castShadow
          intensity={3.1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <Layout lightPosition={lightPosition} />
        </Suspense>
      </Canvas>
    </>
  );
}
