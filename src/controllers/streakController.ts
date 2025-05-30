import { Request, Response } from "express";
import {
  extendStreakService,
  getUserStreakInfoService,
  initializeStreak,
  getHasPrayedTodayService,
} from "../services/streakService";
import { getUserStreakByUserId } from "../services/userStreakService";
import { getStreakActivityService } from "../services/streakActivityService";
import { StreakActivityDTO } from "../validators/dateStringValidator";

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
  const prayedToday = await getHasPrayedTodayService(user.id);

  if (prayedToday.ok) {
    res.status(200).json(prayedToday);
    return;
  }

  const resp = await extendStreakService({
    userId: user.id,
    userStreak: userStreak,
    completedAt: completedAt,
  });

  res.status(resp.ok ? 200 : 409).json(resp);
};

export const getStreakActivityController = async (
  req: Request,
  res: Response
) => {
  const streakActivity = await getStreakActivityService(req.user!.id);

  res.status(streakActivity.ok ? 200 : 409).json(streakActivity);
};

export const getHasPrayedTodayController = async (
  req: Request,
  res: Response
) => {
  const hasPrayedToday = await getHasPrayedTodayService(req.user!.id);

  res.status(hasPrayedToday.ok ? 200 : 409).json(hasPrayedToday);
};
