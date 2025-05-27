import { Request, Response } from "express";
import {
  getProfileService,
  createProfileService,
} from "../services/profileService";

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const profileInfo = await getProfileService(req.user!.id);

  res.status(profileInfo.ok ? 200 : 409).json(profileInfo);
};

export const createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const profileInfo = await getProfileService(req.user!.id);

  if (profileInfo.ok) {
    return res.status(409).json({
      ok: false,
      message: "Profile already exists",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "Profile already exists",
    });
  }

  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "Profile data is required",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "Profile data is required",
    });
  }

  const newProfile = await createProfileService(req.user!.id, body);

  res.status(newProfile.ok ? 201 : 409).json(newProfile);
};
