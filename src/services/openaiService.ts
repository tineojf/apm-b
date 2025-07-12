import { generatePrayer, generateCitation } from "../utils/prompts";
import { fetchOpenAIResponse, fetchOpenAICitation } from "../utils/fetchOpenAI";
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

  const { phrase, updated_at } = data;

  const currentHour = new Date().getHours();
  const updatedHour = parseInt(updated_at.split(":")[0]);

  if (currentHour !== updatedHour) {
    let newCitation: string;
    try {
      newCitation = await fetchOpenAICitation(generateCitation);
    } catch (err) {
      // console.error("Error generating citation:", err);
      return { phrase, updated_at };
    }

    const newTime = `${currentHour.toString().padStart(2, "0")}:00:00`;

    const { error: updateError } = await supabase
      .from("phrase")
      .update({
        phrase: newCitation,
        updated_at: newTime,
      })
      .eq("id", 1);

    if (updateError) {
      throw new Error("Update failed: " + updateError.message);
    }

    return {
      phrase: newCitation,
      updated_at: newTime,
    };
  }

  return { phrase, updated_at };
};

export const createPrayerService = async (answer: string): Promise<any> => {
  const prompt = generatePrayer(answer);
  const result = await fetchOpenAIResponse(prompt);
  return result;
};
