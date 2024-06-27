"use client";

import { motion, Variants } from "framer-motion";

export enum LogoAnimationDirection {
  Up = "-100%",
  Down = "100%",
}

interface LogoProps {
  className: string;
  isVisible: boolean;
  animationDirection: LogoAnimationDirection;
}

export default function Logo({
  className,
  isVisible,
  animationDirection,
}: LogoProps) {
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
      y: animationDirection,
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
      className={`d1 overflow-hidden text-primary-500 ${className}`}
      initial={"hidden"}
      animate={isVisible ? "show" : "hidden"}
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
