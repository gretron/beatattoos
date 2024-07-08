import { emailAddressSchema, passwordSchema } from "~/app/_constants/schemas";
import z from "zod";

/**
 * Validation schema for login form
 */
export const loginFormSchema = z.object({
  emailAddress: emailAddressSchema,
  password: passwordSchema,
});

export const defaultLoginForm: z.infer<typeof loginFormSchema> = {
  emailAddress: "",
  password: "",
};
