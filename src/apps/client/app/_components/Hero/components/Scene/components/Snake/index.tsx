"use client";

import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  AnimationClip,
  Bone,
  Color,
  Mesh,
  MeshBasicMaterial,
  SkinnedMesh,
  Vector3,
} from "three";
import { GLTF } from "three-stdlib";
import { Outlines, useAnimations, useGLTF } from "@react-three/drei";
import { TwoToneShader } from "@/_shaders/TwoToneShader";
import { useFrame } from "@react-three/fiber";
import { LoadingContext } from "@/_contexts/LoadingContext";

/**
 * Props for {@link Snake}
 */
interface SnakeProps {
  children?: ReactNode;
}

/**
 * Snake GLTF animation names
 */
type ActionName = "entrance" | "exit";

/**
 * Snake GLTF animation type
 */
interface GLTFAction extends AnimationClip {
  name: ActionName;
}

/**
 * Snake GLTF import type
 */
type GLTFResult = GLTF & {
  nodes: {
    eyes: Mesh;
    tongue: Mesh;
    snake: SkinnedMesh;
    ROOT: Bone;
  };
  materials: {};
  animations: GLTFAction[];
};

/**
 * Animated 3D snake model
 */
export default function Snake(props: SnakeProps) {
  const groupRef = useRef(null);
  const tongueRef = useRef<Mesh>(null);
  const { setIsLoaded } = useContext(LoadingContext);
  const { nodes, animations, scene } = useGLTF(
    "/models/snake.glb",
  ) as unknown as GLTFResult;
  const { actions, mixer } = useAnimations(animations, groupRef);
  const uniforms = useMemo(() => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#FFEFD6")],
      },
      brightnessThreshold: {
        value: 0.5,
      },
      lightPosition: { value: new Vector3(0, 40, 20) },
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /**
   * Entrance animation
   */
  useEffect(() => {
    setTimeout(() => {
      if (!actions.entrance) return;

      actions.entrance.loop = 2200;
      actions.entrance.clampWhenFinished = true;
      actions.entrance.timeScale = 1.3;
      actions.entrance.reset().play();
    }, 1600);
  }, [actions]);

  /**
   * Tongue extension
   */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = 25;
    const amplitude = 1;

    const extension = Math.sin(t * speed) * amplitude;

    const phase = (t * speed) / (2 * Math.PI);
    const isExtending = Math.floor(phase) % 5 < 2;

    if (tongueRef.current && isExtending) {
      tongueRef.current.position.y = 1 + extension;
    }
  });

  scene.traverse((obj) => {
    const mesh = obj as Mesh;

    if (mesh === nodes.eyes || mesh === nodes.tongue) {
      mesh.material = new MeshBasicMaterial({
        color: new Color("#F05D23"),
        toneMapped: false,
      });
    }

    if (mesh === nodes.tongue) {
      tongueRef.current = mesh;
    }
  });

  return (
    <>
      <group
        ref={groupRef}
        dispose={null}
        position={[0, 8.75, 0]}
        rotation={[Math.PI / 4, 0, 0]}
      >
        <skinnedMesh
          geometry={nodes.snake.geometry}
          skeleton={nodes.snake.skeleton}
        >
          <shaderMaterial
            attach={"material"}
            defines={{ SKINNING_DEFINED: true }}
            uniforms={uniforms}
            {...TwoToneShader}
          />
          <Outlines
            color={"#F05D23"}
            thickness={0.05}
            toneMapped={false}
            screenspace
          />
        </skinnedMesh>
        <primitive object={nodes.ROOT} />
      </group>
    </>
  );
}

useGLTF.preload("/models/snake.glb");
