import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "~/app/auth/_components/Background/components/Scene";

export default function Background() {
  return (
    <div className={"absolute left-0 top-0 z-0 h-full w-full"}>
      <Canvas camera={{ position: [0, 0, -15] }}>
        <OrbitControls minDistance={1} maxDistance={200} makeDefault />
        <Scene />
      </Canvas>
    </div>
  );
}
