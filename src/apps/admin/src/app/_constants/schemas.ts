import z from "zod";

/**
 * Validation scheme for first name
 */
export const firstNameSchema = z.string().min(1, "First name is required");

/**
 * Validation scheme for last name
 */
export const lastNameSchema = z.string().min(1, "Last name is required");

/**
 * Validation schema for email address
 */
export const emailAddressSchema = z
  .string()
  .min(1, "Email address is required")
  .email("Incorrect email address format")
  .default("");

/**
 * Validation schema for password
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .default("");
