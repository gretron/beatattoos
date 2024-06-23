import { useRef, useState } from "react";
import { GothicCircle } from "~/app/auth/_components/Background/components/GothicCircle";
import three, { Vector3 } from "three";

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
      <GothicCircle lightPosition={lightPosition} />
    </>
  );
}
