import z from "zod";
import {
  emailAddressSchema,
  passwordSchema,
} from "~/app/auth/_constants/schemas";

/**
 * Validation schema for register form
 */
export const registerFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    confirmPassword: z.string(),
  })
  .merge(emailAddressSchema)
  .merge(passwordSchema);

const confirmPasswordRefine = (
  { password, confirmPassword }: any,
  ctx: z.RefinementCtx,
) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Confirm password does not match password",
      path: ["confirmPassword"],
    });
  }
};

/**
 * Validation schema for password with confirm password refinement
 */
export const confirmPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine(confirmPasswordRefine);

/**
 * Validation schema for register form with confirm password refinement
 */
export const registerFormSchemaRefined = registerFormSchema.superRefine(
  confirmPasswordRefine,
);

export const defaultRegisterForm: z.infer<typeof registerFormSchema> = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  password: "",
  confirmPassword: "",
};
