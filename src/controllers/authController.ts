import { Request, Response } from "express";
import * as authService from "../services/authService";
import { supabase } from "../utils/supabaseClient";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, fullName } = req.body;
  const response = await authService.registerUser(email, password, fullName);

  if (response.ok) {
    res.status(201).json(response);
  } else {
    res.status(409).json(response);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const response = await authService.loginUser(email, password);

  if (response.ok) {
    res.status(200).json(response);
  } else {
    res.status(401).json(response);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  const response = await authService.refreshToken(refreshToken);

  if (response.ok) {
    res.status(200).json(response);
  } else {
    res.status(401).json(response);
  }
};

export const validateTokenController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(400).json({ valid: false, message: "token required" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    res.status(200).json({ valid: false, message: "token invalid or expired" });
    return;
  }

  res.status(200).json({ valid: true, message: "token valid" });
};
