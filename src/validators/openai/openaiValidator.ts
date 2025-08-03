import { z } from "zod";

export const prayerSchema = z.object({
  answer: z.enum(["bad", "good", "neutral"], {
    required_error: "Validator: answer is required",
    invalid_type_error:
      "Validator: answer must be one of 'bad', 'good', or 'neutral'",
  }),
});

// demo

export type PrayerInput = z.infer<typeof prayerSchema>;
