import z from "zod";

/**
 * Validation schema for email address
 */
export const emailAddressSchema = z.object({
  emailAddress: z
    .string()
    .min(1, "Email address is required")
    .email("Incorrect email address format")
    .default(""),
});

/**
 * Validation schema for password
 */
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .default(""),
});
