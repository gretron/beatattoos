import {
  emailAddressSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from "~/app/_constants/schemas";
import z from "zod";

/**
 * Validation schema for client form
 */
export const clientFormSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  emailAddress: emailAddressSchema,
  password: passwordSchema,
});

export const defaultClientForm: z.infer<typeof clientFormSchema> = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  password: "",
};
