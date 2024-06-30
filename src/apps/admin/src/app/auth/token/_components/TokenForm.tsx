"use client";

import InputField from "@beatattoos/ui/InputField";
import { FormEvent, useState, useTransition } from "react";
import { verifyToken } from "~/app/auth/token/actions";
import { tokenFormSchema } from "~/app/auth/token/_constants/schemas";
import AlertBox from "@beatattoos/ui/AlertBox";
import { useSearchParams } from "next/navigation";
import { Alert, AlertType } from "@beatattoos/ui/Alert";

export default function TokenForm(props: {}) {
  const [token, setToken] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [alert, setAlert] = useState<Alert>({
    type: AlertType.error,
    message: searchParams.get("message") ?? undefined,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setAlert((prev) => ({ ...prev, message: undefined }));

    startTransition(() => {
      verifyToken(new FormData(e.target as HTMLFormElement)).then((res) => {
        if (res) {
          setAlert((prev) => ({ ...prev, message: res?.message }));
        }
      });
    });
  };

  return (
    <form
      className={"flex-grow"}
      aria-label={"tokenForm"}
      onSubmit={handleSubmit}
    >
      <header>
        <h2 className={"mb-2"}>Admin Authentication</h2>
        <h4 className={"mb-8 text-neutral-500"}>
          Enter the administrator token to validate your identity
        </h4>
      </header>
      <InputField
        id={"admin-token"}
        type={"password"}
        name={"adminToken"}
        heading={"Admin token"}
        placeholder={"00000000"}
        schema={tokenFormSchema.shape.adminToken}
        value={token}
        required={true}
        disabled={isPending}
        setValue={setToken}
      />
      <AlertBox className={"mt-6"} alert={alert} setAlert={setAlert} />
      <button className={"btn-primary mt-6 w-full"}>Validate</button>
    </form>
  );
}
