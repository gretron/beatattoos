"use client";

import ClientForm from "~/app/(protected)/clientele/_components/ClientForm";
import { AlertBox, AlertType, useFormState } from "@beatattoos/ui";
import { createClient } from "~/app/(protected)/clientele/new/actions";
import { RequiredLocationFieldsProps } from "~/app/_components/LocationFields";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientWithLocations from "~/app/(protected)/clientele/_types/ClientWithLocations";
import { z } from "zod";
import { userSchema } from "~/app/_constants/schemas";
import { ClienteleContext } from "~/app/(protected)/clientele/_context/ClienteleContext";

/**
 * Props for {@link NewClientForm}
 */
interface NewClientFormProps extends RequiredLocationFieldsProps {}

/**
 * Button to submit add client form
 */
export default function NewClientForm(props: NewClientFormProps) {
  const { formState, isPending, handleSubmit } = useFormState(createClient);
  const { clients, setClients } = useContext(ClienteleContext);
  const router = useRouter();

  useEffect(() => {
    if (formState?.data) {
      setClients([formState.data, ...clients]);
      router.push(`/clientele/${formState.data.id}`);
    }
  }, [formState]);

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
