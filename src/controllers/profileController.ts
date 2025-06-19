import { Request, Response } from "express";
import {
  getProfileService,
  createProfileService,
  updateProfileService,
} from "../services/profileService";
import { ProfileDTO } from "../validators/profile/profileValidator";

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.user!;

    const profile = await getProfileService(user.id);

    res.status(200).json({
      ok: true,
      message: "Profile fetched successfully",
      data: profile,
      dateTime: new Date().toISOString(),
      detail: "Returned user profile",
    });
  } catch (error: any) {
    const statusCode = error.message === "Profile not found" ? 404 : 500;

    res.status(statusCode).json({
      ok: false,
      message: "Error fetching profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const body = req.body as ProfileDTO;

    const profile = await createProfileService(user.id, body);

    return res.status(200).json({
      ok: true,
      message: "Profile created or created successfully",
      data: profile,
      dateTime: new Date().toISOString(),
      detail: "Returned existing or newly created profile",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error creating profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  // const user = req.user!;
  // const body = req.body as ProfileDTO;
  // const profileInfo = await getProfileService(user.id);
  // if (!profileInfo.ok) {
  //   res.status(404).json(profileInfo);
  //   return;
  // }
  // const updatedProfile = await updateProfileService(user.id, body);
  // res.status(updatedProfile.ok ? 200 : 409).json(updatedProfile);
};
