import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string({
      required_error: "Validator: fullName is required",
      invalid_type_error: "Validator: fullName must be a string",
    })
    .trim()
    .min(5, "Validator: fullName must be at least 5 characters")
    .max(50, "Validator: fullName must be less than 50 characters")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/, {
      message: "Validator: fullName must contain only letters and spaces",
    }),
});

export type ProfileDTO = z.infer<typeof profileSchema>;
