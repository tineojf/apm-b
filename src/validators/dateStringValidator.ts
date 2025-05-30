import { z } from "zod";

export const streakActivitySchema = z.object({
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in format YYYY-MM-DD",
  }),
});

export type StreakActivityDTO = z.infer<typeof streakActivitySchema>;
