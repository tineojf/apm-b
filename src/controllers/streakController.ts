import { Request, Response } from "express";
import { getUserStreakInfoService } from "../services/streakService";

import dayjs from "dayjs";

export const getStreakInfoController = async (req: Request, res: Response) => {
  const streakInfo = await getUserStreakInfoService(req.user!.id);

  res.status(streakInfo.ok ? 200 : 409).json(streakInfo);
};
