import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const getFriendByFullNameOrUsernameService = async (name: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .or(`full_name.ilike.%${name}%,username.ilike.%${name}%`);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile[];
};
