import { z } from "zod";

export const relationshipSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().nonempty("Message content is required"),
      })
    )
    .min(1, "Default message is required"),
});

export type RelationshipDTO = z.infer<typeof relationshipSchema>;
