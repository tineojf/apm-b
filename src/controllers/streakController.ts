import { Request, Response } from "express";
import { StreakActivityDTO } from "../validators/dateStringValidator";
import {
  extendStreakService,
  getUserStreakInfoService,
  initializeStreak,
} from "../services/streakService";
import { getUserStreakByUserId } from "../services/userStreakService";
import {
  getAllStreakActivityByUserId,
  getStreakActivityByUserIdAndCompletedAt,
} from "../services/streakActivityService";

export const getStreakInfoController = async (req: Request, res: Response) => {
  const streakInfo = await getUserStreakInfoService(req.user!.id);

  res.status(streakInfo.statusCode).json(streakInfo);
};

export const updateStreakController = async (req: Request, res: Response) => {
  const user = req.user!;
  const { completedAt } = req.body as StreakActivityDTO;

  const userStreak = await getUserStreakByUserId(user.id);

  // If user streak is not found, create a new user streak and streak activity
  if (!userStreak) {
    const resp = await initializeStreak(user.id, completedAt);
    res.status(resp.ok ? 200 : 409).json(resp);
    return;
  }

  // If user has prayed today, return the response
  const prayedToday = await getStreakActivityByUserIdAndCompletedAt(
    user.id,
    completedAt
  );

  if (prayedToday) {
    res.status(403).json({ message: "User completed today's streak" });
    return;
  }

  const resp = await extendStreakService({
    userId: user.id,
    userStreak: userStreak,
    completedAt: completedAt,
  });

  res.status(resp.statusCode).json(resp);
};

export const getStreakActivityController = async (
  req: Request,
  res: Response
) => {
  const streakActivity = await getAllStreakActivityByUserId(req.user!.id);

  res.status(streakActivity.statusCode).json(streakActivity);
};

export const getHasPrayedTodayController = async (
  req: Request,
  res: Response
) => {
  const { completedAt } = req.body as StreakActivityDTO;

  const streakActivity = await getStreakActivityByUserIdAndCompletedAt(
    req.user!.id,
    completedAt
  );

  res.status(streakActivity.statusCode).json(streakActivity);
};
