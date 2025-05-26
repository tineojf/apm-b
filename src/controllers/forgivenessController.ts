import { Request, Response } from "express";
import type { RelationshipDTO } from "../validators/relationshipValidator";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { FORGIVENESS_SYSTEM_PROMPT } from "../prompts/forgivenessPrompt";
import { streamChat } from "../services/chatService";

export const forgivenessChat = async (req: Request, res: Response) => {
  const { messages } = req.body as RelationshipDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: FORGIVENESS_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};
