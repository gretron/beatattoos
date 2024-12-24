"use client";

import { AlertType, InputField, useFormState } from "@beatattoos/ui";
import { useState } from "react";
import { register } from "~/app/auth/register/actions";
import {
  confirmPasswordSchema,
  defaultRegisterFormValues,
  registerFormSchema,
  registerFormSchemaRefined,
} from "~/app/auth/register/_constants/schemas";
import { AlertBox } from "@beatattoos/ui";
import { z } from "zod";
import { Alert } from "@beatattoos/ui";
import LocationFields, {
  RequiredLocationFieldsProps,
} from "~/app/_components/LocationFields";

/**
 * Props for {@link RegisterForm}
 */
interface RegisterFormProps extends RequiredLocationFieldsProps {}

/**
 * Form to register admin user
 */
export default function RegisterForm(props: RegisterFormProps) {
  const [registerForm, setRegisterForm] = useState<
    z.infer<typeof registerFormSchemaRefined>
  >(defaultRegisterFormValues);
  const { formState, isPending, handleSubmit } = useFormState<
    Alert,
    z.infer<typeof registerFormSchemaRefined>
  >(register, undefined, (err) => ({
    type: AlertType.error,
    message: err.message,
  }));

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
        className={"mb-4"}
        placeholder={"John"}
        schema={registerFormSchema.shape.firstName}
        value={registerForm.firstName}
        required={true}
        disabled={isPending}
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
        className={"mb-4"}
        placeholder={"Doe"}
        schema={registerFormSchema.shape.lastName}
        value={registerForm.lastName}
        required={true}
        disabled={isPending}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            lastName: value,
          }))
        }
      />
      <LocationFields countries={props.countries} disabled={isPending} />
      <InputField
        id={"email-address"}
        name={"emailAddress"}
        heading={"Email address"}
        className={"mb-4"}
        placeholder={"john.doe@example.com"}
        schema={registerFormSchema.shape.emailAddress}
        required={true}
        disabled={isPending}
        value={registerForm.emailAddress}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
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
        className={"mb-4"}
        placeholder={"********"}
        schema={registerFormSchema.shape.password}
        required={true}
        disabled={isPending}
        value={registerForm.password}
        setValue={(value) =>
          setRegisterForm((prevState) => ({
            ...prevState,
            password: value,
          }))
        }
      />
      <InputField
        id={"confirm-password"}
        type={"password"}
        name={"confirmPassword"}
        heading={"Confirm password"}
        placeholder={"********"}
        schema={confirmPasswordSchema}
        required={true}
        disabled={isPending}
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
      <AlertBox className={"mt-6"} alert={formState} />
      <button className={"btn-primary mt-6 w-full"}>Register</button>
    </form>
  );
}
