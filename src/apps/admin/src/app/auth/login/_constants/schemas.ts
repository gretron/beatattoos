import {
  emailAddressSchema,
  passwordSchema,
} from "~/app/auth/_constants/schemas";
import z from "zod";

/**
 * Validation schema for login form
 */
export const loginFormSchema = emailAddressSchema.merge(passwordSchema);

export const defaultLoginForm: z.infer<typeof loginFormSchema> = {
  emailAddress: "",
  password: "",
};
