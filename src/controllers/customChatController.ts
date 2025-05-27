import { Request, Response } from "express";

import { streamChat } from "../services/chatService";

import { RELATIONSHIP_SYSTEM_PROMPT } from "../prompts/relationshipPrompt";
import { LIFE_CHALLENGES_SYSTEM_PROMPT } from "../prompts/lifeChallengesPrompt";
import { FORGIVENESS_SYSTEM_PROMPT } from "../prompts/forgivenessPrompt";
import { PRAYER_SYSTEM_PROMPT } from "../prompts/prayerPrompt";

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { StreamingDTO } from "../validators/streamingValidator";

export const relationshipChat = async (req: Request, res: Response) => {
  const { messages } = req.body as StreamingDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: RELATIONSHIP_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};

export const lifeChallengesChat = async (req: Request, res: Response) => {
  const { messages } = req.body as StreamingDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: LIFE_CHALLENGES_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};

export const forgivenessChat = async (req: Request, res: Response) => {
  const { messages } = req.body as StreamingDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: FORGIVENESS_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};

export const prayerChat = async (req: Request, res: Response) => {
  const { messages } = req.body as StreamingDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: PRAYER_SYSTEM_PROMPT },
    ...messages,
  ];

  await streamChat(res, { messages: conversationWithSystem });
};
