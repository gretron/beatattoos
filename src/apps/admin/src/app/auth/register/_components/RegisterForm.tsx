"use client";

import InputField from "@beatattoos/ui/InputField";
import { FormEvent, useState, useTransition } from "react";
import { register } from "~/app/auth/actions";
import {
  confirmPasswordSchema,
  defaultRegisterForm,
  registerFormSchema,
} from "~/app/auth/schemas";
import AlertBox, { AlertType } from "@beatattoos/ui/AlertBox";
import { z } from "zod";

export default function RegisterForm(props: {}) {
  const [registerForm, setRegisterForm] =
    useState<z.infer<typeof registerFormSchema>>(defaultRegisterForm);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    startTransition(async () => {
      await register(new FormData(e.target as HTMLFormElement)).then((res) => {
        setErrorMessage(res?.error);
      });
    });
  };

  return (
    <form
      className={"flex-grow"}
      onSubmit={handleSubmit}
      aria-label={"registerForm"}
    >
      <header>
        <h2 className={"mb-2"}>Register</h2>
        <h4 className={"mb-8 text-neutral-500"}>
          Enter your credentials to create the administrator account
        </h4>
      </header>
      <InputField
        id={"first-name"}
        name={"firstName"}
        heading={"First name"}
        placeholder={"John"}
        schema={registerFormSchema.shape.firstName}
        value={registerForm.firstName}
        required={true}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            firstName: value,
          }))
        }
      />
      <InputField
        id={"last-name"}
        name={"lastName"}
        heading={"Last name"}
        placeholder={"Doe"}
        schema={registerFormSchema.shape.lastName}
        value={registerForm.lastName}
        required={true}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            lastName: value,
          }))
        }
      />
      <InputField
        id={"email-address"}
        name={"emailAddress"}
        heading={"Email address"}
        placeholder={"john.doe@example.com"}
        schema={registerFormSchema.shape.emailAddress}
        value={registerForm.emailAddress}
        required={true}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            emailAddress: value,
          }))
        }
      />
      <InputField
        id={"password"}
        name={"password"}
        heading={"Password"}
        placeholder={"********"}
        schema={registerFormSchema.shape.password}
        required={true}
        value={registerForm.password}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            password: value,
          }))
        }
      />
      <InputField<z.infer<typeof confirmPasswordSchema>>
        id={"confirm-password"}
        name={"confirmPassword"}
        heading={"Confirm password"}
        placeholder={"********"}
        schema={confirmPasswordSchema}
        required={true}
        value={registerForm.confirmPassword}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            confirmPassword: value,
          }))
        }
        validationValue={{
          password: registerForm.password,
          confirmPassword: registerForm.confirmPassword,
        }}
      />
      <AlertBox
        className={"mt-6"}
        type={AlertType.error}
        message={errorMessage}
        setMessage={setErrorMessage}
      />
      <button className={"btn-primary mt-6 w-full"}>Register</button>
    </form>
  );
}