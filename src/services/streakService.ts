import dayjs from "../config/dayjs";
import { supabase } from "../utils/supabaseClient";
import { UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";

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
