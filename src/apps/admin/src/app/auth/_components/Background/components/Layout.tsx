import { animated, useSpring } from "@react-spring/three";
import { Flex } from "@react-three/flex";
import { useThree } from "@react-three/fiber";
import { useAspect } from "@react-three/drei";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { FlexItem } from "~/app/auth/_components/Background/components/FlexItem";
import { BlackWidow } from "~/app/auth/_components/Background/components/BlackWidow";
import GothicCircle from "~/app/auth/_components/Background/components/GothicCircle";
import { Skull } from "~/app/auth/_components/Background/components/Skull";
import Flower from "~/app/auth/_components/Background/components/Flower";
import { TeaCup } from "~/app/auth/_components/Background/components/TeaCup";
import { LuckyCat } from "~/app/auth/_components/Background/components/LuckyCat";
import { Cactus } from "~/app/auth/_components/Background/components/Cactus";

const AnimatedFlex = animated(Flex);

export default function Layout(props: any) {
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
