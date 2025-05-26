import { Request, Response } from "express";
import type { RelationshipDTO } from "../validators/relationshipValidator";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { RELATIONSHIP_SYSTEM_PROMPT } from "../prompts/relationshipPrompt";
import { streamChat } from "../services/chatService";

export const relationshipChat = async (req: Request, res: Response) => {
  const { messages } = req.body as RelationshipDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: RELATIONSHIP_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};
