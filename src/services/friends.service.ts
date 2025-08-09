import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const getFriendByFullNameService = async (fullName: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .ilike("full_name", `%${fullName}%`);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile[];
};
