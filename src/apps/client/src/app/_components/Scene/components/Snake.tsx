import { Outlines, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { a, easings, useScroll, useSpring } from "@react-spring/three";
import { TwoToneShader } from "~/app/_components/Scene/shaders/TwoToneShader";

/**
 * Props for {@link Snake}
 */
interface SnakeProps {}

export default function Snake(props: SnakeProps) {
  const group = useRef<Group>(null!);
  const tongueRef = useRef<Mesh>(null!);
  const [entranceCompleted, setEntranceCompleted] = useState(false);
  const { nodes, animations, scene } = useGLTF("/models/snake.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const { scrollYProgress } = useScroll();
  const { viewport } = useThree();
  const { position } = useSpring({
    position: [0, 8, 0],
    from: { position: [0, viewport.height, 0] },
    config: { duration: 4200, easing: easings.easeOutSine },
  });
  const { animationLerp } = useSpring({
    animationLerp: 0,
    from: { animationLerp: 0 },
    to: {
      animationLerp: entranceCompleted ? 1 : 0,
    },
    config: { duration: 2000, easing: easings.easeOutCirc },
  });

  const uniforms = useMemo(() => {
    return {
      colorMap: {
        value: [new Color("#F05D23"), new Color("#FFF4E0")],
      },
      brightnessThreshold: {
        value: 0.5,
      },
      lightPosition: { value: new Vector3(0, 40, 20) },
    };
  }, []);

  scene.traverse((obj) => {
    const mesh = obj as Mesh;

    if (mesh.isMesh && mesh.name !== "Snake") {
      mesh.material = new MeshBasicMaterial({
        color: new Color("#F05D23"),
        toneMapped: false,
      });

      if (mesh.name === "Tongue") {
        tongueRef.current = mesh;
      }
    }
  });

  /**
   * Entrance animation
   */
  useEffect(() => {
    if (actions.Entrance) {
      actions.Entrance.loop = 2200;
      actions.Entrance.clampWhenFinished = true;
      actions.Entrance.reset().play();

      const onComplete = () => {
        setEntranceCompleted(true);
      };

      mixer.addEventListener("finished", onComplete);

      return () => {
        mixer.removeEventListener("finished", onComplete);
      };
    }
  }, [actions]);

  /**
   * Exit animation
   */
  useEffect(() => {
    if (actions.Entrance && actions.Exit && entranceCompleted) {
      actions.Entrance.fadeOut(0);
      actions.Exit.loop = 2200;
      actions.Exit.clampWhenFinished = true;
      actions.Exit.reset().play();
    }
  }, [entranceCompleted, actions]);

  useFrame(() => {
    scrollYProgress.to((exitAnimationProgress) => {
      if (actions.Exit) {
        actions.Exit.time =
          actions.Exit!.getClip().duration *
          (animationLerp.get() * exitAnimationProgress);
      }
    });
  });

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

  return (
    <a.group ref={group} dispose={null} position={position as any}>
      <group
        name="Armature"
        frustumCulled={false}
        rotation={[Math.PI / 4, 0, 0]}
      >
        <skinnedMesh
          name="Snake"
          geometry={(nodes as any).Snake.geometry}
          skeleton={(nodes as any).Snake.skeleton}
          frustumCulled={false}
        >
          <shaderMaterial
            attach={"material"}
            defines={{ SKINNING_DEFINED: true }}
            {...TwoToneShader}
            uniforms={uniforms}
          />
          <Outlines
            color={"#F05D23"}
            thickness={0.05}
            toneMapped={false}
            screenspace
          />
        </skinnedMesh>
        <primitive object={nodes.ROOT as any}></primitive>
      </group>
    </a.group>
  );
}

useGLTF.preload("/models/snake.glb");
