import {
  emailAddressSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  requiredSchema,
} from "~/app/_constants/schemas";
import z from "zod";

/**
 * Validation schema for client form
 */
export const clientFormSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  countryId: requiredSchema("Country"),
  stateProvinceId: requiredSchema("State/province"),
  cityId: z.string().optional(),
  emailAddress: emailAddressSchema,
  password: passwordSchema,
});

export const defaultClientForm: z.infer<typeof clientFormSchema> = {
  firstName: "",
  lastName: "",
  countryId: "",
  stateProvinceId: "",
  cityId: "",
  emailAddress: "",
  password: "",
};
