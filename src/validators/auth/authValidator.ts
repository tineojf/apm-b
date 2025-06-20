import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Validator: email is required",
      invalid_type_error: "Validator: email must be a string",
    })
    .trim()
    .email("Validator: email must be a valid email address")
    .toLowerCase(),

  password: z
    .string({
      required_error: "Validator: password is required",
      invalid_type_error: "Validator: password must be a string",
    })
    .min(6, "Validator: password must be at least 6 characters")
    .max(64, "Validator: password must be less than 64 characters"),

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

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Validator: email is required",
      invalid_type_error: "Validator: email must be a string",
    })
    .trim()
    .email("Validator: email must be a valid email address")
    .toLowerCase(),

  password: z
    .string({
      required_error: "Validator: password is required",
      invalid_type_error: "Validator: password must be a string",
    })
    .min(6, "Validator: password must be at least 6 characters")
    .max(64, "Validator: password must be less than 64 characters"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
