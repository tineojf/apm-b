import dayjs from "../config/dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

import {
  createUserStreakService,
  getUserStreakByUserId,
  updateUserStreak,
} from "./userStreakService";
import { UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";
import { createResponse } from "../utils/globalResponse";
import { createStreakActivityService } from "./streakActivityService";

dayjs.extend(utc);
dayjs.extend(tz);

const INITIAL_LIVES = 3;
const MIN_STREAK = 0;
const MAX_INACTIVE_DAYS = 3;

//  Función para recalcular vidas y racha automáticamente
const recalculateStreak = (streak: UserStreak) => {
  const userTZ = streak.timezone || "UTC";

  const todayUserTZ = dayjs().tz(userTZ).startOf("day");
  const lastUpdateUserTZ = dayjs(streak.last_completed_date)
    .tz(userTZ)
    .startOf("day");

  const diffDays = todayUserTZ.diff(lastUpdateUserTZ, "day");

  let { current_streak, longest_streak, remaining_lives: lives } = streak;

  if (diffDays >= 2) {
    lives -= diffDays - 1;

    if (lives <= 0) {
      // Reinicia racha
      current_streak = 0;
      lives = 3;
    }

    return {
      current_streak,
      longest_streak,
      remaining_lives: lives,
      last_update: todayUserTZ.format("YYYY-MM-DD"),
      changed: true,
    };
  }

  return { ...streak, changed: false };
};

// Obtener racha y recalcular si es necesario
export const getUserStreakInfoService = async (userId: string) => {
  try {
    const userStreak = await getUserStreakByUserId(userId);

    if (!userStreak)
      return createResponse({
        message: "User streak not found",
        data: null,
        detail: "User streak not found",
        statusCode: 404,
      });

    const updatedStreak_ = recalculateStreak(userStreak);

    console.log(updatedStreak_);

    if (updatedStreak_.changed) {
      const updatedStreak = await updateUserStreak(userId, {
        current_streak: updatedStreak_.current_streak,
        longest_streak: updatedStreak_.longest_streak,
        remaining_lives: updatedStreak_.remaining_lives,
        last_completed_date: updatedStreak_.last_update,
      });
      return createResponse({
        message: "User streak updated",
        data: updatedStreak,
        detail: "User streak updated",
      });
    }

    return createResponse({
      message: "User streak not changed",
      data: userStreak,
      detail: "User streak not changed",
    });
  } catch (error: any) {
    return createResponse({
      message: "Error processing user streak",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });
  }
};

export const extendStreakService = async ({
  userId,
  userStreak,
}: {
  userId: string;
  userStreak: UserStreak;
}) => {
  try {
    const userTZ = userStreak.timezone || "UTC";
    const todayUserTZ = dayjs().tz(userTZ).startOf("day");
    const lastUpdateUserTZ = dayjs(userStreak.last_completed_date)
      .tz(userTZ)
      .startOf("day");

    let { current_streak, longest_streak, remaining_lives, last_update } =
      recalculateStreak(userStreak);

    if (todayUserTZ.diff(lastUpdateUserTZ, "day") === 0) {
      return createResponse({
        message: "Ya actualizaste hoy",
        data: userStreak,
        detail: "User completed today's streak",
        statusCode: 403,
      });
    }

    if (remaining_lives > 0) {
      current_streak += 1;
      if (current_streak > longest_streak) {
        longest_streak = current_streak;
      }
      last_update = todayUserTZ.format("YYYY-MM-DD");
    }

    const updatedStreak = await updateUserStreak(userId, {
      current_streak,
      longest_streak,
      last_completed_date: last_update,
      remaining_lives,
    });

    const userActivity = await createStreakActivityService(
      userId,
      last_update!
    );

    if (!userActivity.ok) throw new Error("User activity creation failed");

    return createResponse({
      message: "User streak updated",
      data: {
        userStreak: updatedStreak,
        streakActivity: userActivity,
      },
      detail: "User streak updated",
    });
  } catch (error: any) {
    return createResponse({
      message: "Failed to update user streak",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });
  }
};

export const initializeStreak = async (
  userId: string,
  timezone: string
): Promise<GlobalResponse> => {
  try {
    const today = dayjs()
      .tz(timezone || "UTC")
      .format("YYYY-MM-DD");

    const newUserStreak = await createUserStreakService(
      userId,
      today,
      timezone
    );

    if (!newUserStreak.ok) throw new Error("User streak creation failed");

    const userActivity = await createStreakActivityService(userId, today);

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
