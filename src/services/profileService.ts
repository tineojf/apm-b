import { GlobalResponse } from "../models/globalResponseModel";
import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const getProfileService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, is_premium, created_at")
    .eq("id", userId)
    .single();

  if (error)
    return {
      ok: false,
      message: "Error fetching profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };

  const dataProfile = data as Profile;

  return {
    ok: true,
    message: "Profile fetched successfully",
    data: dataProfile,
    dateTime: new Date().toISOString(),
    detail: "Profile fetched successfully",
  };
};
