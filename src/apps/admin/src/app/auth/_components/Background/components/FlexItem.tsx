import { Box } from "@react-three/flex";
import React from "react";
import { Align, JustifyContent } from "@react-three/flex";
import { useThree } from "@react-three/fiber";
import { useAspect } from "@react-three/drei";
import { usePathname } from "next/navigation";

/**
 * Props for {@link FlexItem}
 */
interface FlexItemProps {
  width: number;
  height: number;
  marginTop?: number;
  marginRight?: number;
  marginLeft?: number;
  alignItems?: Align;
  justifyContent?: JustifyContent;
  children?: React.ReactNode;
}

/**
 * Flex item utility wrapper
 */
export function FlexItem(props: FlexItemProps) {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const pathname = usePathname();

  return (
    <Box
      flexBasis={
        (pathname === "/auth" || size.width < 768 ? vpWidth : vpWidth / 2) *
          props.width -
        0.1
      }
      height={vpHeight * props.height - 0.1}
      flexGrow={1}
      flexDirection={"row"}
      alignItems={props.alignItems}
      justifyContent={props.justifyContent}
      marginTop={props.marginTop}
      marginRight={props.marginRight}
      marginLeft={props.marginLeft}
    >
      <Box width={0} height={0} centerAnchor>
        {props.children}
      </Box>
    </Box>
  );
}
