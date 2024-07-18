"use client";

import { FormEvent, ReactNode, useState, useTransition } from "react";
import { z } from "zod";
import { InputField } from "@beatattoos/ui";
import { Alert, AlertType } from "@beatattoos/ui";
import { AlertBox } from "@beatattoos/ui";
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
  alert?: Alert;
  action: (formData: FormData) => Promise<Alert>;
}

/**
 * Form for client add/edit operations
 */
function ClientForm(props: ClientFormProps) {
  const [clientForm, setClientForm] =
    useState<z.infer<typeof userSchema>>(defaultUserValues);
  const [alert, setAlert] = useState<Alert>({ type: AlertType.error });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setAlert((prev) => ({ ...prev, message: undefined }));

    startTransition(async () => {
      await props
        .action(new FormData(e.target as HTMLFormElement))
        .then((res) => {
          setAlert((prev) => ({ ...prev, message: res?.message }));
        });
    });
  };

  return (
    <form
      className={"flex grow flex-col"}
      aria-label={"Client form"}
      onSubmit={handleSubmit}
    >
      <div className={"grow"}>
        <InputField
          id={"first-name"}
          name={"firstName"}
          heading={"First name"}
          placeholder={"John"}
          className={"mb-4"}
          disabled={isPending}
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
          disabled={isPending}
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
        <LocationFields countries={props.countries} disabled={isPending} />
        <InputField
          id={"email-address"}
          name={"emailAddress"}
          heading={"Email address"}
          placeholder={"john.doe@example.com"}
          className={"mb-4"}
          disabled={isPending}
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
          isPending={isPending}
          value={clientForm.password}
          setValue={(value) =>
            setClientForm((prevState) => ({
              ...prevState,
              password: value,
            }))
          }
        />
      </div>
      <div>
        {props.alert && (
          <AlertBox
            className={"mt-6"}
            alert={props.alert}
            setAlert={undefined}
          />
        )}
        <AlertBox className={"mt-6"} alert={alert} setAlert={setAlert} />
        <button className={"btn-primary mt-6 w-full"}>Add Client</button>
      </div>
    </form>
  );
}

export default ClientForm;
