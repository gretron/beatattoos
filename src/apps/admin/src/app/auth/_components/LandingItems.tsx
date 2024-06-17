"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

interface LandingItemsProps {
  className: string;
  isVisible: boolean;
}

export default function LandingItems(props: LandingItemsProps) {
  const router = useRouter();

  const itemsVariants: Variants = {
    hidden: {
      y: 40,
      opacity: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      id={"landing-items"}
      className={props.className}
      initial={"hidden"}
      animate={props.isVisible ? "show" : "hidden"}
      variants={itemsVariants}
    >
      <h1
        className={
          "mb-8 whitespace-nowrap text-center text-neutral-500 max-md:!text-2xl"
        }
      >
        Admin Dashboard
      </h1>
      <button className={"btn-primary mb-3 w-full"} type={"button"}>
        Log In
      </button>
      <button
        className={"btn-secondary w-full"}
        onClick={() => router.push("/auth/token")}
        type={"button"}
      >
        First Time Setup
      </button>
    </motion.div>
  );
}
