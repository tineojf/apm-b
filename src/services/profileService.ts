import { mapToProfileEntity } from "../mappers/profileMapper";
import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { ProfileInput } from "../validators/profile/profileValidator";
import { GlobalResponse } from "../models/globalResponseModel";

export const getProfileService = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, is_premium, created_at")
    .eq("id", userId);

  if (error) {
    throw new Error("DB: " + error.message);
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
  id: string,
  body: ProfileInput
): Promise<Profile> => {
  try {
    const existingProfile = await getProfileService(id);
    return existingProfile;
  } catch (error: any) {
    if (error.message !== "Profile not found") {
      throw new Error(error.message);
    }
  }

  const newProfile = mapToProfileEntity({ id, body });

  const { data, error } = await supabase
    .from("profile")
    .insert(newProfile)
    .select("full_name, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile;
};

export const updateProfileService = async (
  id: string,
  body: ProfileInput
): Promise<Profile> => {
  await getProfileService(id);

  const newProfile = mapToProfileEntity({ id, body });

  const { data, error } = await supabase
    .from("profile")
    .update(newProfile)
    .eq("id", id)
    .select("full_name, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  if (!data) {
    throw new Error("Profile not found after update");
  }

  return data as Profile;
};

export const deleteProfileService = async (
  userId: string
): Promise<GlobalResponse> => {
  try {
    const { error: streakError } = await supabase
      .from("streak_activity")
      .delete()
      .eq("user_id", userId);
    const { error: userStreaksError } = await supabase
      .from("user_streaks")
      .delete()
      .eq("user_id", userId);
    const { error: profileError } = await supabase
      .from("profile")
      .delete()
      .eq("id", userId);

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (streakError || userStreaksError || profileError || authError) {
      return {
        ok: false,
        message: "Error deleting profile",
        data: null,
        dateTime: new Date().toISOString(),
        detail: "Error deleting profile",
      };
    }

    return {
      ok: true,
      message: "Profile deleted successfully",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "Profile deleted successfully",
    };
  } catch (error) {
    console.log("error->", error);
    return {
      ok: false,
      message: "Error deleting profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  }
};