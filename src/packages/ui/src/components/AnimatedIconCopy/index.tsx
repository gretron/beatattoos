import { IconCheck } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * Props for {@link AnimatedIconCheck}
 */
interface AnimatedIconCheckProps {
  className?: string;
}

/**
 * Animated copy icon
 */
export default function AnimatedIconCheck(props: AnimatedIconCheckProps) {
  return <IconCheck className={`${props.className} ${styles.icon}`} />;
}
