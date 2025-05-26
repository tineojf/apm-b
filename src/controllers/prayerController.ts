import { Request, Response } from "express";
import type { RelationshipDTO } from "../validators/relationshipValidator";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { PRAYER_SYSTEM_PROMPT } from "../prompts/prayerPrompt";
import { streamChat } from "../services/chatService";

export const prayerChat = async (req: Request, res: Response) => {
  const { messages } = req.body as RelationshipDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: PRAYER_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};
