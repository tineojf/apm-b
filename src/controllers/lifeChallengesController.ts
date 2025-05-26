import { Request, Response } from "express";
import type { RelationshipDTO } from "../validators/relationshipValidator";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { LIFE_CHALLENGES_SYSTEM_PROMPT } from "../prompts/lifeChallengesPrompt";
import { streamChat } from "../services/chatService";

export const lifeChallengesChat = async (req: Request, res: Response) => {
  const { messages } = req.body as RelationshipDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: LIFE_CHALLENGES_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};
