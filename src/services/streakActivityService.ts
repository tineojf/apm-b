import { supabase } from "../utils/supabaseClient";

import { type StreakActivity } from "../types/supabase";
import { createResponse, type GlobalResponse } from "../utils/globalResponse";

export const createStreakActivityService = async (
  userId: string,
  completedAt: string
): Promise<GlobalResponse<StreakActivity | null>> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .insert({
      user_id: userId,
      completed_at: completedAt,
    })
    .select()
    .single();

  if (error)
    return createResponse({
      message: "Streak activity creation failed",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });

  return createResponse({
    message: "Streak activity created successfully",
    data: data as StreakActivity,
    detail: "Streak activity created successfully",
  });
};

export const getAllStreakActivityByUserId = async (
  userId: string
): Promise<GlobalResponse<StreakActivity[]>> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error)
    return createResponse({
      message: "Streak activity retrieval failed",
      data: [],
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });

  return createResponse({
    message: "Streak activity retrieved successfully",
    data: data as StreakActivity[],
    detail: "Streak activity retrieved successfully",
  });
};
