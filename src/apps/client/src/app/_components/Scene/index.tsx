import { Canvas, useThree } from "@react-three/fiber";
import Snake from "~/app/_components/Scene/components/Snake";
import { useEffect } from "react";

/**
 * Props for {@link Scene}
 */
interface SceneProps {}

export default function Scene(props: SceneProps) {
  return (
    <div className={"absolute left-0 top-0 z-20 h-full w-full"}>
      <Canvas
        camera={{
          zoom: 50,
          near: -1000,
          far: 1000,
        }}
        orthographic
      >
        <Snake />
        <UpdateZoom />
      </Canvas>
    </div>
  );
}

/**
 * Props for {@link UpdateZoom}
 */
interface UpdateZoomProps {}

function UpdateZoom(props: UpdateZoomProps) {
  const { camera, size } = useThree();

  useEffect(() => {
    const MD_BREAKPOINT = 768;

    if (size.width < MD_BREAKPOINT) {
      camera.zoom = 30;
    } else {
      camera.zoom = 50;
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
