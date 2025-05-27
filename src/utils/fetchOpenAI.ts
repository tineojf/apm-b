import OpenAI from "openai";
import { config } from "../config/config";

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const fetchOpenAIResponse = async (prompt: string) => {
  try {
    const data = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 150,
    });

    return data.output_text;
  } catch (error) {
    console.log("Error fetching OpenAI response:", error);
  }
};
