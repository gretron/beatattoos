"use client";

import "./styles/globals.css";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  IconAlertOctagonFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconX,
} from "@tabler/icons-react";

export enum AlertType {
  error,
  success,
  warning,
  info,
}

interface AlertBoxProps {
  className?: string;
  type: AlertType;
  message?: string;
  setMessage?: (value?: string) => void;
  marginTop?: number;
}

export default function AlertBox(props: AlertBoxProps) {
  const type = AlertType[props.type];
  const icons = [
    <IconAlertOctagonFilled className={"flex-shrink-0"} />,
    <IconCircleCheckFilled className={"flex-shrink-0"} />,
    <IconAlertOctagonFilled className={"flex-shrink-0"} />,
    <IconInfoCircleFilled className={"flex-shrink-0"} />,
  ];

  const alertVariants: Variants = {
    hidden: {
      gridTemplateRows: "0fr",
      opacity: 0,
    },
    show: {
      gridTemplateRows: "1fr",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      {props.message && (
        <motion.aside
          className={`${props.className} grid rounded-2xl border bg-${type}-300 border-${type}-500`}
          initial={"hidden"}
          animate={"show"}
          variants={alertVariants}
          aria-label={"alert"}
          role={"note"}
        >
          <div className={`overflow-hidden`}>
            <div className={"p-4 flex items-center gap-3"}>
              {icons[props.type]}
              <p className={"flex-grow"}>{props.message}</p>
              <IconX
                className={"btn-icon flex-shrink-0"}
                onClick={() => props.setMessage?.(undefined)}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </>
  );
}
