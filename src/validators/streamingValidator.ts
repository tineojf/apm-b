import { z } from "zod";

export enum Role {
  USER = "user",
  BOT = "assistant",
}

export const streamingSchema = z.object({
  messages: z
    .array(
      z.object({
        content: z.string().nonempty("Message content is required"),
        role: z.enum([Role.USER, Role.BOT]),
      })
    )
    .min(1, "Default message is required"),
});

export type StreamDTO = z.infer<typeof streamingSchema>;
