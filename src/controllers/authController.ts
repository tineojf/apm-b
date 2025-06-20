import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import { LoginDTO, RegisterDTO } from "../validators/auth/authValidator";
import {
  // registerUserService
  refreshTokenService,
  loginUserService,
} from "../services/authService";

// export const registerUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const body = req.body as RegisterDTO;

//     const user = await registerUserService(body);

//     res.status(201).json({
//       ok: true,
//       message: "User created successfully",
//       data: user,
//       dateTime: new Date().toISOString(),
//       detail: "Returned newly created user",
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       ok: false,
//       message: "Error creating user",
//       data: null,
//       dateTime: new Date().toISOString(),
//       detail: error.message,
//     });
//   }
// };

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as LoginDTO;

    const user = await loginUserService(body);

    res.status(201).json({
      ok: true,
      message: "User logged in successfully",
      data: user,
      dateTime: new Date().toISOString(),
      detail: "Returned user login information",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error logging in user",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

// export const loginUser2 = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { email, password } = req.body;
//   const response = await loginUserService(email);

//   if (response.ok) {
//     res.status(200).json(response);
//   } else {
//     res.status(401).json(response);
//   }
// };

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  const response = await refreshTokenService(refreshToken);

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
