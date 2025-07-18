import OpenAI from "openai";
import { config } from "../config/config";

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const fetchOpenAIResponse = async (prompt: string): Promise<string> => {
  const today = new Date().toISOString().slice(0, 10);
  const randomSeed = Math.random().toString(36).substring(2, 8);

  const dynamicPrompt = `${prompt}\nToday: ${today}, Seed: ${randomSeed}`;

  try {
    const data = await client.responses.create({
      model: "gpt-4o-mini",
      input: dynamicPrompt,
      max_output_tokens: 150,
    });

    if (!data?.output_text) {
      throw new Error("No output text from OpenAI");
    }

    return data.output_text;
  } catch (error: any) {
    throw new Error("OpenAI Error: " + (error.message || error.toString()));
  }
};
