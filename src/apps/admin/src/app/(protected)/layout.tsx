import BackgroundColor from "~/app/_components/BackgroundColor";
import React from "react";

export default async function ProtectedLayout(props: any) {
  return (
    <>
      <section>{props.children}</section>
      <BackgroundColor color={"#FFEFD6"} />
    </>
  );
}
