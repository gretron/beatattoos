"use client";

import Scene from "~/app/_components/Scene";
import { motion, Variants } from "framer-motion";

/**
 * Props for {@link Hero}
 */
interface HeroProps {}

export default function Hero(props: HeroProps) {
  const headerVariants: Variants = {
    hidden: {
      y: "100%",
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: (custom) => ({
      y: "0%",
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: custom,
      },
    }),
  };

  const subHeaderVariants: Variants = {
    hidden: {
      y: 5,
      opacity: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: 1,
      },
    },
  };

  return (
    <div className={"relative h-screen min-h-[600px] w-full bg-primary-500"}>
      <Scene />
      <div
        className={
          "absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center"
        }
      >
        <header
          className={
            "d1 flex w-[20.5rem] flex-col text-[6rem] leading-[4.8rem] md:w-[38rem] md:text-[11rem] md:leading-[9rem]"
          }
        >
          <div className={"z-30 overflow-hidden"}>
            <motion.div
              className={"relative top-[10px] md:top-[20px]"}
              variants={headerVariants}
              initial={"hidden"}
              animate={"show"}
            >
              bea
            </motion.div>
          </div>
          <div className={"self-end overflow-hidden"}>
            <motion.div
              className={"relative top-[10px] md:top-[20px]"}
              variants={headerVariants}
              initial={"hidden"}
              animate={"show"}
              custom={0.3}
            >
              <span className={"relative z-30"}>tatt</span>
              <span className={"relative"}>oos</span>
            </motion.div>
          </div>
        </header>
        <div
          className={
            "absolute top-[50%] translate-y-[8rem] text-center tracking-[0.9rem] text-neutral-500 md:mt-24 md:text-xl md:tracking-[2rem]"
          }
        >
          <motion.div
            variants={subHeaderVariants}
            initial={"hidden"}
            animate={"show"}
          >
            TATTOO · ARTIS<span className={"tracking-normal"}>T</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
