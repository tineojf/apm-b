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

const INITIAL_LIVES = 3;
const MIN_STREAK = 0;
const MAX_INACTIVE_DAYS = 3;

const resetStreak = async (userId: string): Promise<UserStreak> => {
  return updateUserStreak(userId, {
    current_streak: MIN_STREAK,
    remaining_lives: INITIAL_LIVES,
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

const shouldResetMonthlyLives = (lastCompletedDate: string): boolean => {
  const today = dayjs();
  const lastCompleted = dayjs(lastCompletedDate);

  // Verifica si el mes actual es diferente al último completado
  return (
    today.month() !== lastCompleted.month() ||
    today.year() !== lastCompleted.year()
  );
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

    // Verificar si es un mes diferente al último completado
    if (
      shouldResetMonthlyLives(userStreak.last_completed_date) &&
      shouldResetMonthlyLives(userStreak.last_lives_reset)
    ) {
      const daysSinceLastCompletion = today.diff(
        dayjs(userStreak.last_completed_date),
        "day"
      );

      console.log("Days since last completion", daysSinceLastCompletion);

      // Si el usuario no completó el desafío en más de 3 días, resetear el streak
      if (daysSinceLastCompletion > MAX_INACTIVE_DAYS) {
        const resetStreak_ = await resetStreak(userId);

        console.log("Streak reset due to inactivity", resetStreak_);
        return createResponse({
          message: "Streak reset due to inactivity",
          data: resetStreak_,
          detail: `Streak reset due to ${daysSinceLastCompletion} days of inactivity. Lives reset to ${INITIAL_LIVES} for the new month.`,
        });
      }

      // Si el usuario completó el desafío en los últimos 3 días, solo resetear las vidas
      const updatedStreak = await updateUserStreak(userId, {
        remaining_lives: INITIAL_LIVES,
        last_lives_reset: new Date().toISOString(),
      });

      console.log("Monthly lives reset", updatedStreak);

      return createResponse({
        message: "Monthly lives reset",
        data: updatedStreak,
        detail: `Lives reset to ${INITIAL_LIVES} for the new month. Streak maintained.`,
      });
    }

    // Verificar si el usuario ya validó hoy
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

    // Verificar si el usuario completó el desafío el día anterior
    if (lastCompletedDate.isSame(yesterday, "day")) {
      console.log("User streak found - Last completion was yesterday");
      return createResponse({
        message: "User streak found - Last completion was yesterday",
        data: userStreak,
        detail: "User streak found - Last completion was yesterday",
      });
    }

    // Verificar si el usuario completó el desafío en los últimos 3 días
    if (
      daysSinceLastCompletion <= MAX_INACTIVE_DAYS &&
      daysSinceLastCompletion > 1
    ) {
      const daysToDeduct = daysSinceLastCompletion - 1;
      const updatedStreak = await deductLives(
        userId,
        userStreak.remaining_lives,
        daysToDeduct
      );

      const message =
        updatedStreak.remaining_lives === INITIAL_LIVES
          ? "User streak reset due to no remaining lives"
          : "User streak updated - Lives deducted";

      const detail = `Streak ${
        updatedStreak.remaining_lives === INITIAL_LIVES ? "reset" : "maintained"
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

    // Verificar si el usuario no completó el desafío en más de 3 días
    const updatedStreak = await resetStreak(userId);
    console.log("User streak reset due to inactivity", updatedStreak);
    return createResponse({
      message: "User streak reset due to inactivity",
      data: updatedStreak,
      detail: "Streak reset - More than 3 days of inactivity",
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
    const completedAtStartOfDay = dayjs(completedAt).startOf("day");
    const lastCompletedDate = dayjs(userStreak.last_completed_date).startOf(
      "day"
    );
    const serverDate = dayjs().startOf("day");

    // Validar que la fecha no sea futura
    if (completedAtStartOfDay.isAfter(serverDate)) {
      return createResponse({
        message: "Invalid completion date",
        data: null,
        detail: "Cannot complete streak for future dates",
        statusCode: 400,
      });
    }

    // Validar que la fecha no sea anterior al último registro
    // Todo: Que pasaria si el usuario su ultimo registro es hace 5 dias, podra completar los 5 dias?
    if (completedAtStartOfDay.isBefore(lastCompletedDate)) {
      return createResponse({
        message: "Invalid completion date",
        data: null,
        detail: "Cannot complete streak for past dates",
        statusCode: 400,
      });
    }

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
