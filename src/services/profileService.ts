import { mapToProfileEntity } from "../mappers/profileMapper";
import { GlobalResponse } from "../models/globalResponseModel";
import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { ProfileDTO } from "../validators/profile/profileValidator";

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
  id: string,
  body: ProfileDTO
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

export const fetchProfileByUserId = async (
  userId: string
): Promise<{ profile: Profile | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, is_premium, created_at")
    .eq("id", userId)
    .single();

  if (data === null) {
    return { profile: null, error: new Error("Profile not found") };
  }

  if (error) {
    return { profile: null, error };
  }
  return { profile: data as Profile, error: null };
};
