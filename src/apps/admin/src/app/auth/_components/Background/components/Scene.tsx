import { useRef, useState } from "react";
import { GothicCircle } from "~/app/auth/_components/Background/components/GothicCircle";
import three, { Vector3 } from "three";
import { Flower } from "~/app/auth/_components/Background/components/Flower";
import { Center, Float, PivotControls } from "@react-three/drei";

export default function Scene() {
  const lightRef = useRef<three.PointLight>(null);
  const [lightPosition, setLightPosition] = useState<Vector3>(
    new Vector3(15, 5, 0),
  );

  return (
    <>
      <pointLight
        position={lightPosition}
        ref={lightRef}
        color={"#ffffff"}
        castShadow
        intensity={3.1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Float
        speed={1}
        rotationIntensity={1}
        floatIntensity={1}
        floatingRange={[1, 2]}
      >
        <Center position={[10, 10, 10]} rotation={[0, 0, 0]}>
          <Flower lightPosition={lightPosition} />
        </Center>
      </Float>
      <Float
        speed={1}
        rotationIntensity={1}
        floatIntensity={1}
        floatingRange={[1, 2]}
      >
        <GothicCircle
          position={[-8, 5, 0]}
          rotation={[180, 0, 0]}
          lightPosition={lightPosition}
        />
      </Float>
    </>
  );
}
