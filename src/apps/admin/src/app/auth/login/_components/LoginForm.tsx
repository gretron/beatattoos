"use client";

import { AlertBox, InputField, useFormState } from "@beatattoos/ui";
import { useState } from "react";
import { z } from "zod";
import {
  defaultLoginForm,
  loginFormSchema,
} from "~/app/auth/login/_constants/schemas";
import { login } from "~/app/auth/login/actions";

/**
 * Form to log into admin account
 */
export default function LoginForm() {
  const [loginForm, setLoginForm] =
    useState<z.infer<typeof loginFormSchema>>(defaultLoginForm);
  const { formState, isPending, handleSubmit } = useFormState(login);

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
      <AlertBox className={"mt-6"} alert={formState} />
      <button className={"btn-primary mt-6 w-full"}>Log In</button>
    </form>
  );
}
