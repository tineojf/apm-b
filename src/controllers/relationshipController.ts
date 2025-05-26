import { Request, Response } from "express";
import OpenAI from "openai";
import type { RelationshipDTO } from "../validators/relationshipValidator";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { RELATIONSHIP_SYSTEM_PROMPT } from "../prompts/relationshipPrompt";
import { MODEL_GPT_4O_MINI } from "../prompts/model";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const relationshipChat = async (req: Request, res: Response) => {
  const { messages } = req.body as RelationshipDTO;

  const conversationWithSystem: ChatCompletionMessageParam[] = [
    { role: "system", content: RELATIONSHIP_SYSTEM_PROMPT },
    ...messages,
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL_GPT_4O_MINI,
      messages: conversationWithSystem,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Stream error:", err);
    res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
    res.end();
  }
};
