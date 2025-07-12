import { generatePrayer, generateCitation } from "../utils/prompts";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";
import { supabase } from "../utils/supabaseClient";

export const getCitationService = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("phrase")
    .select("phrase, updated_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }
  if (!data) {
    throw new Error("No citation found");
  }

  const result = data;
  console.log("getCitationService result:", result);
  

  // verificar la hora

  // solicitar frase a openai
  const newCitation = await fetchOpenAIResponse(generateCitation);

  // actualizar la frase y la hora en supabase

  return result;
};

export const createPrayerService = async (answer: string): Promise<any> => {
  const prompt = generatePrayer(answer);
  const result = await fetchOpenAIResponse(prompt);
  return result;
};
