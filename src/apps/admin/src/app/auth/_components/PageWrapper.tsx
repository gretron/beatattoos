"use client";

import { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Props for {@link PageWrapper}
 */
interface PageWrapperProps {
  children: ReactNode;
}

/**
 * Authentication page wrapper with reveal animation
 */
export default function PageWrapper(props: PageWrapperProps) {
  const pageVariants: Variants = {
    hidden: {
      y: 40,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.main
      className={"flex h-full justify-center p-6 md:p-10"}
      initial={"hidden"}
      animate={"show"}
      variants={pageVariants}
    >
      {props.children}
    </motion.main>
  );
}
