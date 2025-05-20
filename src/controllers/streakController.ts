import { Request, Response } from "express";
import {
  extendStreakService,
  getUserStreakByUserId,
  getUserStreakInfoService,
  initializeStreak,
} from "../services/streakService";
import dayjs from "dayjs";

export const getStreakInfoController = async (req: Request, res: Response) => {
  const streakInfo = await getUserStreakInfoService(req.user!.id);

  res.status(streakInfo.ok ? 200 : 409).json(streakInfo);
};

export const updateStreakController = async (req: Request, res: Response) => {
  const user = req.user!;

  const userStreak = await getUserStreakByUserId(user.id);

  // If user streak is not found, create a new user streak and streak activity
  if (!userStreak) {
    const resp = await initializeStreak(user.id);
    res.status(resp.ok ? 200 : 409).json(resp);
    return;
  }

  const resp = await extendStreakService({
    userId: user.id,
    userStreak: userStreak,
  });

  res.status(resp.ok ? 200 : 409).json(resp);
};
