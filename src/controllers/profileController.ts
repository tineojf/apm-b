import { Request, Response } from "express";
import {
  getProfileService,
  createProfileService,
  updateProfileService,
  deleteProfileService,
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

export const createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = req.user!;
  const body = req.body as ProfileDTO;

  const profileInfo = await getProfileService(user.id);

  if (profileInfo.ok) {
    return res.status(409).json({
      ok: false,
      message: "Profile already exists",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "Profile already exists",
    });
  }

  const newProfile = await createProfileService(user.id, body);
  res.status(newProfile.ok ? 201 : 409).json(newProfile);
};

export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = req.user!;

  const deletedProfile = await deleteProfileService(user.id);

  res.status(deletedProfile.ok ? 200 : 409).json(deletedProfile);
};
