"use client";

import { InputField } from "@beatattoos/ui";
import { FormEvent, useActionState, useState, useTransition } from "react";
import { AlertBox } from "@beatattoos/ui";
import { z } from "zod";
import { Alert, AlertType } from "@beatattoos/ui";
import {
  defaultLoginForm,
  loginFormSchema,
} from "~/app/auth/login/_constants/schemas";
import { login } from "~/app/auth/login/actions";

async function increment(previousState: number, formData: FormData) {
  return previousState + 1;
}

/**
 * Form to log into admin account
 */
export default function LoginForm() {
  const [loginForm, setLoginForm] =
    useState<z.infer<typeof loginFormSchema>>(defaultLoginForm);
  const [alert, setAlert] = useState<Alert>({ type: AlertType.error });
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(increment, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setAlert((prev) => ({ ...prev, message: undefined }));

    startTransition(async () => {
      await login(new FormData(e.target as HTMLFormElement))
        .then((res) => {
          setAlert((prev) => ({ ...prev, message: res?.message }));
        })
        .catch(() => {
          /* When log in is successful */
        });
    });
  };

  return (
    <form
      className={"flex-grow"}
      aria-label={"Log in form"}
      onSubmit={handleSubmit}
    >
      <header>
        <h2 className={"mb-2"}>Log In</h2>
        <h4 className={"mb-8 text-neutral-500"}>
          Enter the credentials to log into the administrator account
        </h4>
      </header>
      <InputField
        id={"email-address"}
        name={"emailAddress"}
        heading={"Email address"}
        placeholder={"john.doe@example.com"}
        className={"mb-4"}
        schema={loginFormSchema.shape.emailAddress}
        required={true}
        disabled={isPending}
        value={loginForm.emailAddress}
        setValue={(value) =>
          setLoginForm((prevState) => ({
            ...prevState,
            emailAddress: value,
          }))
        }
      />
      <InputField
        id={"password"}
        type={"password"}
        name={"password"}
        heading={"Password"}
        placeholder={"********"}
        schema={loginFormSchema.shape.password}
        required={true}
        disabled={isPending}
        value={loginForm.password}
        setValue={(value) =>
          setLoginForm((prevState) => ({
            ...prevState,
            password: value,
          }))
        }
      />
      <AlertBox className={"mt-6"} alert={alert} setAlert={setAlert} />
      <button className={"btn-primary mt-6 w-full"}>Log In</button>
    </form>
  );
}
