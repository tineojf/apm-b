import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(5, "Validator: Full name is required")
    .max(50, "Validator: Full name must be less than 50 characters")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/, {
      message: "Validator: Full name must contain only letters and spaces",
    }),
});

export type ProfileDTO = z.infer<typeof profileSchema>;
