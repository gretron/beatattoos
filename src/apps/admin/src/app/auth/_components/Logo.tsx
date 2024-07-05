"use client";

import { motion, Variants } from "framer-motion";

/**
 * Direction for logo animation
 */
export enum LogoAnimationDirection {
  Up = "-100%",
  Down = "100%",
}

/**
 * Props for {@link Logo}
 */
interface LogoProps {
  /** Logo additional class names */
  className: string;
  /** Current animation state */
  isVisible: boolean;
  /** Hide/show animation direction */
  animationDirection: LogoAnimationDirection;
}

/**
 * Authentication layout animated logo
 */
export default function Logo(props: LogoProps) {
  const logoVariants: Variants = {
    hidden: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
    show: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      y: props.animationDirection,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={`d1 overflow-hidden text-primary-500 ${props.className}`}
      initial={"hidden"}
      animate={props.isVisible ? "show" : "hidden"}
      variants={logoVariants}
    >
      {"beatattoos".split("").map((letter, index) => (
        <motion.span
          key={index}
          className={"inline-block"}
          variants={letterVariants}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
