"use client";

import InputField from "@beatattoos/ui/InputField";
import { FormEvent, useState, useTransition } from "react";
import { verifyToken } from "~/app/auth/actions";
import { tokenFormSchema } from "~/app/auth/schemas";
import AlertBox, { AlertType } from "@beatattoos/ui/AlertBox";
import { useSearchParams } from "next/navigation";

export default function TokenForm(props: {}) {
  const [token, setToken] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState(
    searchParams.get("message") ?? undefined,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    startTransition(() => {
      verifyToken(new FormData(e.target as HTMLFormElement)).then((res) => {
        if (res) {
          setErrorMessage(res.error);
        }
      });
    });
  };

  return (
    <form className={"flex-grow"} onSubmit={handleSubmit}>
      <header>
        <h2 className={"mb-2"}>Admin Authentication</h2>
        <h4 className={"mb-8 text-neutral-500"}>
          Enter the administrator token to validate your identity
        </h4>
      </header>
      <InputField
        id={"admin-token"}
        name={"adminToken"}
        heading={"Admin token"}
        placeholder={"00000000"}
        schema={tokenFormSchema.shape.adminToken}
        value={token}
        required={true}
        disabled={isPending}
        setValue={setToken}
      />
      <AlertBox
        className={"mt-6"}
        type={AlertType.error}
        message={errorMessage}
        setMessage={setErrorMessage}
      />
      <button className={"btn-primary mt-6 w-full"}>Validate</button>
    </form>
  );
}
