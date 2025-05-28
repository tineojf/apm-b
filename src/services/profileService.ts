import { GlobalResponse } from "../models/globalResponseModel";
import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const fetchProfileByUserId = async (
  userId: string
): Promise<{ profile: Profile | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, is_premium, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    return { profile: null, error };
  }
  return { profile: data as Profile, error: null };
};

export const getProfileService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { profile, error } = await fetchProfileByUserId(userId);

  if (error)
    return {
      ok: false,
      message: "Error fetching profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };

  return {
    ok: true,
    message: "Profile fetched successfully",
    data: profile,
    dateTime: new Date().toISOString(),
    detail: "Profile fetched successfully",
  };
};

export const createProfileService = async (
  userId: string,
  profileData: any
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("profile")
    .insert({ id: userId, full_name: profileData.fullName })
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      message: "Error creating profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };
  }

  return {
    ok: true,
    message: "Profile created successfully",
    data: data as Profile,
    dateTime: new Date().toISOString(),
    detail: "Profile created successfully",
  };
};
