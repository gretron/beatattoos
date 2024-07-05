import dynamic from "next/dynamic";
import styles from "~/app/auth/_components/Background/components/Scene/styles.module.css";

/**
 * Lazy load 3D scene
 */
const Scene = dynamic(
  () => import("~/app/auth/_components/Background/components/Scene/index"),
  {
    ssr: false,
  },
);

/**
 * Authentication 3D background
 */
export default function Background() {
  return (
    <div className={`${styles.animate} fixed left-0 top-0 z-0 h-full w-full`}>
      <Scene />
    </div>
  );
}
