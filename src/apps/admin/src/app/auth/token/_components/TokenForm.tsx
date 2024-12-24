"use client";

import {
  Alert,
  AlertBox,
  AlertType,
  InputField,
  useFormState,
} from "@beatattoos/ui";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { verifyToken } from "~/app/auth/token/actions";
import { tokenFormSchema } from "~/app/auth/token/_constants/schemas";
import { useSearchParams } from "next/navigation";

/**
 * Form to validate admin token
 */
export default function TokenForm() {
  const [token, setToken] = useState<string>("");
  const searchParams = useSearchParams();
  const { handleSubmit, formState, isPending } = useFormState<
    Alert,
    { adminToken: string }
  >(verifyToken, undefined, (err) => ({
    type: AlertType.error,
    message: err.message,
  }));

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
      <AlertBox className={"mt-6"} alert={formState} />
      <button className={"btn-primary mt-6 w-full"}>Validate</button>
    </form>
  );
}
