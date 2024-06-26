import { Box, FlexProps } from "@react-three/flex";
import React, { RefObject } from "react";
import { Align, JustifyContent } from "@react-three/flex";
import { useThree } from "@react-three/fiber";
import { useAspect } from "@react-three/drei";

interface FlexItemProps {
  width: number;
  height: number;
  margin?: number;
  breakpoints?: number[];
  alignItems?: Align;
  justifyContent?: JustifyContent;
  children?: React.ReactNode;
}

export function FlexItem(props: FlexItemProps) {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);

  return (
    <Box
      flexBasis={vpWidth * props.width - 0.1}
      height={vpHeight * props.height - 0.1}
      flexGrow={1}
      flexDirection={"row"}
      alignItems={props.alignItems}
      justifyContent={props.justifyContent}
    >
      <Box width={0} height={0} centerAnchor>
        {props.children}
      </Box>
    </Box>
  );
}
