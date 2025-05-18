"use client";

import { ReactNode, Suspense, useContext, useEffect } from "react";
import Snake from "./components/Snake";
import { Canvas, useThree } from "@react-three/fiber";
import { LoadingContext } from "@/_contexts/LoadingContext";
import "./styles.css";

/**
 * Props for {@link Scene}
 */
interface SceneProps {
  children?: ReactNode;
}

/**
 * Hero section 3D scene
 */
export default function Scene(props: SceneProps) {
  const { isLoaded } = useContext(LoadingContext);

  return (
    <>
      <div
        className={`bt-hero-scene ${isLoaded ? "bt-hero-scene--is-loaded" : ""}`}
      >
        <Canvas
          id={"canvas"}
          camera={{
            zoom: 50,
            near: -100,
            far: 100,
          }}
          orthographic
          style={{ pointerEvents: "none" }}
        >
          <Snake />
          <UpdateZoom />
        </Canvas>
      </div>
    </>
  );
}

/**
 * Responsive zoom update
 */
function UpdateZoom() {
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
