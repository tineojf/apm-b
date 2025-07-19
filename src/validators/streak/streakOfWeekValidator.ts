import { z } from "zod";

export const streakWeekMonthSchema = z.object({
  today: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "today must be a date in YYYY-MM-DD format",
    })
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      },
      {
        message: "today must be a valid calendar date",
      }
    ),
});

export type streakWeekMonthInput = z.infer<typeof streakWeekMonthSchema>;
