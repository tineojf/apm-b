import { z } from "zod";

export const prayerSchema = z.object({
  answer: z.enum(["Bad", "Good", "Neutral", "Bien", "Mal"], {
    required_error: "Validator: answer is required",
    invalid_type_error:
      "Validator: answer must be one of 'bad', 'good', 'neutral', 'bien' or 'mal'",
  }),
});

export type PrayerInput = z.infer<typeof prayerSchema>;
