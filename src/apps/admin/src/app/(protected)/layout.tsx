import React from "react";

export default async function ProtectedLayout(props: any) {
  return (
    <>
      <section>{props.children}</section>
    </>
  );
}
