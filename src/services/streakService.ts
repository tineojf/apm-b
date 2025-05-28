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

  if (error) {
    console.log("error in getUserStreakByUserId", error);
    console.log("data in getUserStreakByUserId", data);
    return null;
  }

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
      message: "initialize streak failed",
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
  userId: string,
  completedAt?: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .insert({
      user_id: userId,
      completed_at: completedAt ?? new Date().toISOString(),
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

export const extendStreakService = async ({
  userId,
  userStreak,
  completedAt,
}: {
  userId: string;
  userStreak: UserStreak;
  completedAt?: string;
}): Promise<GlobalResponse> => {
  try {
    const userActivity = await createStreakActivityService(userId, completedAt);

    if (!userActivity.ok) throw new Error("User activity creation failed");

    const newCurrentStreak = userStreak.current_streak + 1;

    const { data: updatedStreak, error: updateError } = await supabase
      .from("user_streaks")
      .update({
        current_streak: newCurrentStreak,
        longest_streak: Math.max(userStreak.longest_streak, newCurrentStreak),
        last_completed_date: completedAt ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw new Error("User streak update failed");

    return {
      ok: true,
      message: "User streak and activity updated successfully",
      data: {
        userStreak: updatedStreak,
        streakActivity: userActivity.data,
      },
      dateTime: new Date().toISOString(),
      detail: "User streak and activity updated successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "Failed to update user streak",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };
  }
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

export const getHasPrayedTodayService = async (
  userId: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("completed_at")
    .eq("user_id", userId)
    .eq("completed_at", dayjs().format("YYYY-MM-DD"))
    .single();

  if (error)
    return {
      ok: false,
      message: "Not found user's prayed today",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };

  return {
    ok: true,
    message: "Found user's prayed today",
    data: data as StreakActivity,
    dateTime: new Date().toISOString(),
    detail: "Streak activity retrieved successfully",
  };
};
