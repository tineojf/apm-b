import OpenAI from "openai";
import { generatePrayer, generateCitation } from "../utils/prompts";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";

export const getRandomBibleCitation = async (): Promise<any> => {
  const result = await fetchOpenAIResponse(generateCitation);
  return result;
};

export const createPrayerFromAnswer = async (answer: string): Promise<any> => {
  const prompt = generatePrayer(answer);
  const result = await fetchOpenAIResponse(prompt);
  return result;
};
