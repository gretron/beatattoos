import z from "zod";

export const tokenFormSchema = z.object({
  adminToken: z.string().min(1, "Admin token is required"),
});
