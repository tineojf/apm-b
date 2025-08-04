import { generatePrayer } from "../prompts/dailyPrayerPrompt";
import { generateCitation } from "../prompts/citationPrompt";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";
import { supabase } from "../utils/supabaseClient";

export const getCitationService = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("phrase")
    .select("phrase, updated_at")
    .eq("id", 1)
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
      newCitation = await fetchOpenAIResponse(generateCitation);
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

    const { error: insertError } = await supabase
      .from("phrase_history")
      .insert({
        phrase: newCitation,
        updated_at: newTime,
      })
      .select();

    if (insertError) {
      throw new Error("Insert failed: " + insertError.message);
    }
  }

  return { phrase, updated_at };
};

export const createPrayerService = async (
  answer: string,
  lang: string
): Promise<string> => {
  const language = lang === "en" ? "english" : "spanish";
  const prompt = generatePrayer(answer, language);
  const result = await fetchOpenAIResponse(prompt);
  return result;
};
