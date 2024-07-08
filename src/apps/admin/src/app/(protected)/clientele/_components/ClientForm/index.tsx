"use client";

import { FormEvent, ReactNode, useState, useTransition } from "react";
import { z } from "zod";
import {
  clientFormSchema,
  defaultClientForm,
} from "~/app/(protected)/clientele/_constants/schemas";
import InputField from "@beatattoos/ui/InputField";
import { Alert, AlertType } from "@beatattoos/ui/Alert";
import AlertBox from "@beatattoos/ui/AlertBox";
import PasswordField from "~/app/(protected)/clientele/_components/ClientForm/components/PasswordField";
import { useFormState } from "react-dom";

/**
 * Props for {@link ClientForm}
 */
interface ClientFormProps {
  children?: ReactNode;
  alert?: Alert;
  action: (formData: FormData) => Promise<Alert>;
}

/**
 * Form for client add/edit operations
 */
function ClientForm(props: ClientFormProps) {
  const [clientForm, setClientForm] =
    useState<z.infer<typeof clientFormSchema>>(defaultClientForm);
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
          schema={clientFormSchema.shape.firstName}
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
          schema={clientFormSchema.shape.lastName}
          required={true}
          value={clientForm.lastName}
          setValue={(value) =>
            setClientForm((prevState) => ({
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
          className={"mb-4"}
          disabled={isPending}
          schema={clientFormSchema.shape.emailAddress}
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
