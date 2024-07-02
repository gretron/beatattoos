"use client";

import React, { useEffect } from "react";

interface BackgroundColorProps {
  color: string;
}

export default function BackgroundColor(props: BackgroundColorProps) {
  useEffect(() => {
    document.body.style.backgroundColor = props.color;
  }, [props.color]);

  return <></>;
}
