"use client";

import ClientForm from "~/app/(protected)/clientele/_components/ClientForm";
import { Alert, AlertBox, AlertType, useFormState } from "@beatattoos/ui";
import { createClient2 } from "~/app/(protected)/clientele/new/actions";
import { RequiredLocationFieldsProps } from "~/app/_components/LocationFields";
import { useEffect, useMemo } from "react";

/**
 * Props for {@link NewClientForm}
 */
interface NewClientFormProps extends RequiredLocationFieldsProps {}

/**
 * Button to submit add client form
 */
export default function NewClientForm(props: NewClientFormProps) {
  const { formState, isPending, handleSubmit } = useFormState(createClient2);

  return (
    <ClientForm
      isPending={isPending}
      countries={props.countries}
      handleSubmit={handleSubmit}
    >
      <AlertBox
        className={"mt-6"}
        alert={{
          type: AlertType.warning,
          message: "You must transmit the entered password to the client",
        }}
      />
      <AlertBox className={"mt-6"} alert={formState?.alert} />
      <button className={"btn-primary mt-6 w-full"}>Add Client</button>
    </ClientForm>
  );
}
