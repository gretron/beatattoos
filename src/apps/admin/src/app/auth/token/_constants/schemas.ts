import z from "zod";

/**
 * Validation schema for admin token
 */
export const tokenFormSchema = z.object({
  adminToken: z.string().min(1, "Admin token is required"),
});
