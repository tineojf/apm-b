import { Request, Response } from "express";
import * as userService from "../services/userService";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, fullName } = req.body;
  const response = await userService.registerUser(email, password, fullName);

  if (response.ok) {
    res.status(201).json(response);
  } else {
    res.status(400).json(response);
  }
};
