import dayjs from "../config/dayjs";
import {
  createUserStreakService,
  getUserStreakByUserId,
  updateUserStreak,
} from "./userStreakService";
import { UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";
import { createResponse } from "../utils/globalResponse";
import { createStreakActivityService } from "./streakActivityService";

const resetStreak = async (userId: string): Promise<UserStreak> => {
  return updateUserStreak(userId, {
    current_streak: 0,
    remaining_lives: 3,
    last_lives_reset: new Date().toISOString(),
  });
};

const deductLives = async (
  userId: string,
  currentLives: number,
  daysToDeduct: number
): Promise<UserStreak> => {
  const newRemainingLives = currentLives - daysToDeduct;

  if (newRemainingLives <= 0) {
    return resetStreak(userId);
  }

  return updateUserStreak(userId, {
    remaining_lives: newRemainingLives,
  });
};

export const getUserStreakInfoService = async (userId: string) => {
  try {
    const userStreak = await getUserStreakByUserId(userId);

    if (!userStreak) {
      return createResponse({
        message: "User streak not found",
        data: null,
        detail: "User streak not found",
        statusCode: 404,
      });
    }

    const lastUpdate = dayjs(userStreak.updated_at);
    const today = dayjs();

    if (lastUpdate.isSame(today, "day")) {
      console.log("User streak found - Already validated today");
      return createResponse({
        message: "User streak found - Already validated today",
        data: userStreak,
        detail: "User streak found - Already validated today",
      });
    }

    const lastCompletedDate = dayjs(userStreak.last_completed_date);
    const yesterday = today.subtract(1, "day").startOf("day");
    const daysSinceLastCompletion = today.diff(lastCompletedDate, "day");

    if (lastCompletedDate.isSame(yesterday, "day")) {
      console.log("User streak found - Last completion was yesterday");
      return createResponse({
        message: "User streak found - Last completion was yesterday",
        data: userStreak,
        detail: "User streak found - Last completion was yesterday",
      });
    }

    if (daysSinceLastCompletion > 3) {
      const updatedStreak = await resetStreak(userId);
      console.log("User streak reset due to inactivity", updatedStreak);
      return createResponse({
        message: "User streak reset due to inactivity",
        data: updatedStreak,
        detail: "User streak reset due to inactivity",
      });
    }

    if (daysSinceLastCompletion <= 3 && daysSinceLastCompletion > 1) {
      const daysToDeduct = daysSinceLastCompletion - 1;
      const updatedStreak = await deductLives(
        userId,
        userStreak.remaining_lives,
        daysToDeduct
      );

      const message =
        updatedStreak.remaining_lives === 3
          ? "User streak reset due to no remaining lives"
          : "User streak updated - Lives deducted";

      const detail = `Streak ${
        updatedStreak.remaining_lives === 3 ? "reset" : "maintained"
      } - Lost ${daysToDeduct} lives due to ${daysSinceLastCompletion} days of inactivity. ${
        updatedStreak.remaining_lives
      } lives remaining`;

      console.log(message, updatedStreak);

      return createResponse({
        message,
        data: updatedStreak,
        detail,
      });
    }

    console.log("User streak found - No changes needed", userStreak);
    return createResponse({
      message: "User streak found - No changes needed",
      data: userStreak,
      detail: "User streak found - No changes needed",
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

export const initializeStreak = async (
  userId: string,
  createdDate: string
): Promise<GlobalResponse> => {
  try {
    const newUserStreak = await createUserStreakService(userId, createdDate);

    if (!newUserStreak.ok) throw new Error("User streak creation failed");

    const userActivity = await createStreakActivityService(userId, createdDate);

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

export const extendStreakService = async ({
  userId,
  userStreak,
  completedAt,
}: {
  userId: string;
  userStreak: UserStreak;
  completedAt: string;
}) => {
  try {
    const userActivity = await createStreakActivityService(userId, completedAt);

    if (!userActivity.ok) throw new Error("User activity creation failed");

    const newCurrentStreak = userStreak.current_streak + 1;

    const updatedStreak = await updateUserStreak(userId, {
      current_streak: newCurrentStreak,
      longest_streak: Math.max(userStreak.longest_streak, newCurrentStreak),
      last_completed_date: completedAt,
    });

    return createResponse({
      message: "User streak and activity updated successfully",
      data: {
        userStreak: updatedStreak,
        streakActivity: userActivity.data,
      },
      detail: "User streak and activity updated successfully",
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
