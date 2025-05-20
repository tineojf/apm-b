import dayjs from "../config/dayjs";
import { supabase } from "../utils/supabaseClient";
import { StreakActivity, UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";
import { supabaseApi } from "../utils/fetchSupabase";

export const getUserStreakInfoService = async (
  userId: string
): Promise<GlobalResponse> => {
  const userStreak = await getUserStreakByUserId(userId);

  if (!userStreak)
    return {
      ok: false,
      message: "User streak not found",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "User streak not found",
    };

  return {
    ok: true,
    message: "User streak found",
    data: userStreak,
    dateTime: new Date().toISOString(),
    detail: "User streak found",
  };
};

export const getUserStreakByUserId = async (
  userId: string
): Promise<UserStreak | null> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;

  return data as UserStreak;
};

export const initializeStreak = async (
  userId: string
): Promise<GlobalResponse> => {
  try {
    const newUserStreak = await createUserStreakService(userId);

    if (!newUserStreak.ok) throw new Error("User streak creation failed");

    const userActivity = await createStreakActivityService(userId);

    if (!userActivity.ok) throw new Error("User activity creation failed");

    return {
      ok: true,
      message: "User streak and activity created successfully",
      data: {
        userStreak: newUserStreak.data,
        streakActivity: userActivity.data,
      },
      dateTime: new Date().toISOString(),
      detail: "User streak and activity created successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "User streak creation failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };
  }
};

export const createUserStreakService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .insert({
      user_id: userId,
      last_completed_date: new Date().toISOString(),
      current_streak: 1,
      longest_streak: 1,
      remaining_lives: 3,
      last_lives_reset: new Date().toISOString(),
    })
    .select()
    .single();

  if (error)
    return {
      ok: false,
      message: "User streak creation failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };

  return {
    ok: true,
    message: "User streak created successfully",
    data: data as UserStreak,
    dateTime: new Date().toISOString(),
    detail: "User streak created successfully",
  };
};

export const createStreakActivityService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .insert({
      user_id: userId,
      completed_at: new Date().toISOString(),
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
