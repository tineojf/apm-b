import { generatePrayer, generateCitation } from "../utils/prompts";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";

export const getCitationService = async (): Promise<any> => {
  const result = await fetchOpenAIResponse(generateCitation);
  return result;
};

export const createPrayerService = async (answer: string): Promise<any> => {
  const prompt = generatePrayer(answer);
  const result = await fetchOpenAIResponse(prompt);
  return result;
};
