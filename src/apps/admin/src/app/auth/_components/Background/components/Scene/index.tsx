"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import three, { Vector3 } from "three";

import { OrbitControls, useAspect } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Flex } from "@react-three/flex";
import { FlexItem } from "~/app/auth/_components/Background/components/FlexItem";
import { BlackWidow } from "~/app/auth/_components/Background/components/BlackWidow";
import { Skull } from "~/app/auth/_components/Background/components/Skull";
import { TeaCup } from "~/app/auth/_components/Background/components/TeaCup";
import { Cactus } from "~/app/auth/_components/Background/components/Cactus";
import { LuckyCat } from "~/app/auth/_components/Background/components/LuckyCat";
import { usePathname } from "next/navigation";
import { animated, useSpring } from "@react-spring/three";
import GothicCircle from "~/app/auth/_components/Background/components/GothicCircle";
import Flower from "~/app/auth/_components/Background/components/Flower";

const AnimatedFlex = animated(Flex);

function Layout(props: any) {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const pathname = usePathname();

  const isExpanded = useMemo(
    () => pathname === "/auth" || size.width < 768,
    [pathname, size.width],
  );

  const springs = useSpring({
    position: [isExpanded ? 0 : vpWidth / -4, 0, 0] as [number, number, number],
  });

  return (
    <AnimatedFlex
      flexDirection={"row"}
      flexWrap={"wrap"}
      position={springs.position}
      size={[isExpanded ? vpWidth : vpWidth / 2, vpHeight, 0]}
      marginTop={2}
      centerAnchor
    >
      {/* Item 1 */}
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        alignItems={"center"}
        justifyContent={
          size.width < 768
            ? "flex-start"
            : pathname === "/auth"
              ? "center"
              : "flex-start"
        }
      >
        <BlackWidow lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 2 */}
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        marginTop={isExpanded ? 0 : -2}
        justifyContent={"center"}
      >
        <GothicCircle lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 3 */}
      <FlexItem
        width={1 / 3}
        height={1 / 3}
        alignItems={"center"}
        justifyContent={
          size.width < 768
            ? "flex-end"
            : pathname === "/auth"
              ? "center"
              : "flex-end"
        }
      >
        <Skull lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 4 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        alignItems={"center"}
        justifyContent={isExpanded ? "flex-start" : "center"}
      >
        <Flower lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 5 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        alignItems={"center"}
        justifyContent={isExpanded ? "flex-end" : "center"}
      >
        <TeaCup lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 6 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        alignItems={"flex-end"}
        justifyContent={isExpanded ? "center" : "flex-start"}
      >
        <LuckyCat lightPosition={props.lightPosition} />
      </FlexItem>
      {/* Item 7 */}
      <FlexItem
        width={1 / 2}
        height={1 / 3}
        alignItems={"flex-end"}
        justifyContent={isExpanded ? "center" : "flex-end"}
      >
        <Cactus lightPosition={props.lightPosition} />
      </FlexItem>
    </AnimatedFlex>
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
