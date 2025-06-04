import { Request, Response } from "express";
import {
  getProfileService,
  updateProfileService,
} from "../services/profileService";
import { ProfileDTO } from "../validators/profile/profileValidator";

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const user = req.user!;

  const profileInfo = await getProfileService(user.id);
  res.status(profileInfo.ok ? 200 : 409).json(profileInfo);
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = req.user!;
  const body = req.body as ProfileDTO;

  const profileInfo = await getProfileService(user.id);
  if (!profileInfo.ok) {
    res.status(404).json(profileInfo);
    return;
  }

  const updatedProfile = await updateProfileService(user.id, body);
  res.status(updatedProfile.ok ? 200 : 409).json(updatedProfile);
};
