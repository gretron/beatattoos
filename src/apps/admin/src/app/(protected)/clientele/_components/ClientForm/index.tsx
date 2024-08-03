"use client";

import { FormEvent, ReactNode, useState } from "react";
import { z } from "zod";
import { InputField } from "@beatattoos/ui";
import PasswordField from "~/app/(protected)/clientele/_components/ClientForm/components/PasswordField";
import LocationFields, {
  RequiredLocationFieldsProps,
} from "~/app/_components/LocationFields";
import { defaultUserValues, userSchema } from "~/app/_constants/schemas";

/**
 * Props for {@link ClientForm}
 */
interface ClientFormProps extends RequiredLocationFieldsProps {
  children?: ReactNode;
  isPending: boolean;
  handleSubmit: (e: FormEvent) => void;
}

/**
 * Form for client add/edit operations
 */
export default function ClientForm(props: ClientFormProps) {
  const [clientForm, setClientForm] =
    useState<z.infer<typeof userSchema>>(defaultUserValues);

  return (
    <form
      className={"flex grow flex-col"}
      aria-label={"Client form"}
      onSubmit={props.handleSubmit}
    >
      <div className={"grow"}>
        <InputField
          id={"first-name"}
          name={"firstName"}
          heading={"First name"}
          placeholder={"John"}
          className={"mb-4"}
          disabled={props.isPending}
          schema={userSchema.shape.firstName}
          required={true}
          value={clientForm.firstName}
          setValue={(value) =>
            setClientForm((prevState) => ({
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
          className={"mb-4"}
          disabled={props.isPending}
          schema={userSchema.shape.lastName}
          required={true}
          value={clientForm.lastName}
          setValue={(value) =>
            setClientForm((prevState) => ({
              ...prevState,
              lastName: value,
            }))
          }
        />
        <LocationFields
          countries={props.countries}
          disabled={props.isPending}
        />
        <InputField
          id={"email-address"}
          name={"emailAddress"}
          heading={"Email address"}
          placeholder={"john.doe@example.com"}
          className={"mb-4"}
          disabled={props.isPending}
          schema={userSchema.shape.emailAddress}
          required={true}
          value={clientForm.emailAddress}
          setValue={(value) =>
            setClientForm((prevState) => ({
              ...prevState,
              emailAddress: value,
            }))
          }
        />
        <PasswordField
          isPending={props.isPending}
          value={clientForm.password}
          setValue={(value) =>
            setClientForm((prevState) => ({
              ...prevState,
              password: value,
            }))
          }
        />
      </div>
      <div>{props.children}</div>
    </form>
  );
}
