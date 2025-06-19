import { GlobalResponse } from "../models/globalResponseModel";
import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const getProfileService = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, is_premium, created_at")
    .eq("id", userId);

  if (error) {
    throw new Error("Supabase error: " + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Profile not found");
  }

  if (data.length > 1) {
    throw new Error("Multiple profiles found for user");
  }

  return data[0] as Profile;
};

export const createProfileService = async (
  userId: string,
  body: any
): Promise<Profile> => {
  try {
    const existingProfile = await getProfileService(userId);
    return existingProfile;
  } catch (error: any) {
    if (error.message !== "Profile not found") {
      throw new Error(error.message);
    }
  }

  const { data, error } = await supabase
    .from("profile")
    .insert({ id: userId, full_name: body.full_name })
    .select("full_name, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("Supabase error: " + error.message);
  }

  return data as Profile;
};

export const updateProfileService = async (
  userId: string,
  profileData: any
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("profile")
    .update({ full_name: profileData.full_name })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      message: "Error updating profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };
  }

  return {
    ok: true,
    message: "Profile updated successfully",
    data: data as Profile,
    dateTime: new Date().toISOString(),
    detail: "Profile updated successfully",
  };
};
