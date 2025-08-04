import { generatePrayer } from "../prompts/dailyPrayerPrompt";
import { generateCitation } from "../prompts/citationPrompt";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";
import { supabase } from "../utils/supabaseClient";
import { generateSpanishPrompt } from "../prompts/citationTranslationPrompt";

export const getCitationService = async (): Promise<any> => {
  const fetchPhrase = async (id: number) => {
    const { data, error } = await supabase
      .from("phrase")
      .select("phrase, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) throw new Error(`DB(id: ${id}): ${error?.message}`);

    return data;
  };

  const updatePhrase = async (
    id: number,
    phrase: string,
    updated_at: string
  ) => {
    const { error } = await supabase
      .from("phrase")
      .update({ phrase, updated_at })
      .eq("id", id);

    if (error) throw new Error(`Update failed for id ${id}: ${error.message}`);
  };

  const enData = await fetchPhrase(1);
  const esData = await fetchPhrase(2);

  const currentHour = new Date().getHours();
  const updatedHour = parseInt(enData.updated_at.split(":")[0]);

  if (currentHour !== updatedHour) {
    try {
      const newEN = await fetchOpenAIResponse(generateCitation);
      const newES = await fetchOpenAIResponse(generateSpanishPrompt(newEN));

      const newTime = `${currentHour.toString().padStart(2, "0")}:00:00`;

      await updatePhrase(1, newEN, newTime);
      await updatePhrase(2, newES, newTime);

      const { error: insertError } = await supabase
        .from("phrase_history")
        .insert({ phrase: newEN, updated_at: newTime });
      if (insertError) throw new Error("Insert failed: " + insertError.message);

      return {
        phrase: {
          en: newEN,
          es: newES,
        },
        updated_at: newTime,
      };
    } catch {}
  }

  return {
    phrase: {
      en: enData.phrase,
      es: esData.phrase,
    },
    updated_at: enData.updated_at,
  };
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
