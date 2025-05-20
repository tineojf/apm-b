import { Request, Response } from "express";
import {
  getUserStreakByUserId,
  getUserStreakInfoService,
  initializeStreak,
} from "../services/streakService";

export const getStreakInfoController = async (req: Request, res: Response) => {
  const streakInfo = await getUserStreakInfoService(req.user!.id);

  res.status(streakInfo.ok ? 200 : 409).json(streakInfo);
};

export const updateStreakController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = req.user!;

  const userStreak = await getUserStreakByUserId(user.id);

  // If user streak is not found, create a new user streak and streak activity
  if (!userStreak) {
    const resp = await initializeStreak(user.id);
    res.status(resp.ok ? 200 : 409).json(resp);
    return;
  }

  // const updateUserStreak = await updateUserStreakService({
  //   userId: user.id,
  //   token: token!,
  //   userStreak: userStreak,
  // });

  // res.status(updateUserStreak.ok ? 200 : 409).json(updateUserStreak);

  res.status(500).json({ ok: false });
  return;
};
