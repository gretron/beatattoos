import z from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  emailAddress: z
    .string()
    .min(1, "Email address is required")
    .email("Incorrect email address format")
    .default(""),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .default(""),
  confirmPassword: z.string(),
});

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

export const confirmPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine(confirmPasswordRefine);

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
