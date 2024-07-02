import z from "zod";

export const emailAddressSchema = z.object({
  emailAddress: z
    .string()
    .min(1, "Email address is required")
    .email("Incorrect email address format")
    .default(""),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .default(""),
});
