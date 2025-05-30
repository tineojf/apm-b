import { GlobalResponse } from "../models/globalResponseModel";
import { StreakActivity } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const createStreakActivityService = async (
  userId: string,
  completedAt: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .insert({
      user_id: userId,
      completed_at: completedAt,
    })
    .select()
    .single();

  if (error)
    return {
      ok: false,
      message: "Streak activity creation failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };

  return {
    ok: true,
    message: "Streak activity created successfully",
    data: data as StreakActivity,
    dateTime: new Date().toISOString(),
    detail: "Streak activity created successfully",
  };
};

export const getStreakActivityService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error)
    return {
      ok: false,
      message: "Streak activity retrieval failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };

  return {
    ok: true,
    message: "Streak activity retrieved successfully",
    data: data as StreakActivity[],
    dateTime: new Date().toISOString(),
    detail: "Streak activity retrieved successfully",
  };
};
