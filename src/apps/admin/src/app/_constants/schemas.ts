import z from "zod";

/**
 * Validation schema for required field
 * @param fieldName the field name
 */
export const requiredSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Validation schema for first name
 */
export const firstNameSchema = requiredSchema("First name");

/**
 * Validation schema for last name
 */
export const lastNameSchema = requiredSchema("Last name");

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

/**
 * Validation schema for user
 */
export const userSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  countryId: requiredSchema("Country"),
  stateProvinceId: requiredSchema("State/province"),
  cityId: z.string().optional(),
  emailAddress: emailAddressSchema,
  password: passwordSchema,
});

export const defaultUserValues: z.infer<typeof userSchema> = {
  firstName: "",
  lastName: "",
  countryId: "",
  stateProvinceId: "",
  cityId: "",
  emailAddress: "",
  password: "",
};
