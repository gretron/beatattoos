"use client";

import "./styles/globals.css";
import { motion, Variants } from "framer-motion";
import {
  IconAlertOctagonFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconX,
} from "@tabler/icons-react";
import { Alert, AlertType } from "./types/Alert";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AlertBoxProps {
  className?: string;
  alert: Alert;
  setAlert: Dispatch<SetStateAction<Alert>>;
}

export default function AlertBox(props: AlertBoxProps) {
  const [alert, setAlert] = useState(props.alert);
  const type = AlertType[props.alert.type];
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

  useEffect(() => {
    setAlert(props.alert);
  }, [props.alert]);

  return (
    <>
      {alert.message && (
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
              {icons[props.alert.type]}
              <p className={"flex-grow"}>{props.alert.message}</p>
              <IconX
                className={"btn-icon flex-shrink-0"}
                onClick={() =>
                  setAlert((prev) => ({ ...prev, message: undefined }))
                }
              />
            </div>
          </div>
        </motion.aside>
      )}
    </>
  );
}
