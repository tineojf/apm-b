import { Request, Response } from "express";
import { getProfileService } from "../services/profileService";

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const profileInfo = await getProfileService(req.user!.id);

  res.status(profileInfo.ok ? 200 : 409).json(profileInfo);
};
