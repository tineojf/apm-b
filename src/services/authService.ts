import axios from "axios";
import dotenv from "dotenv";
import { supabase } from "../utils/supabaseClient";
import { GlobalResponse } from "../models/globalResponseModel";
import { toRefreshTokenDTO } from "../mappers/tokenMapper";
import { LoginDTO, RegisterDTO } from "../validators/auth/authValidator";
import { Login, Register } from "../types/supabase";
import {
  mapToLoginDTO,
  mapToRegisterDTO,
  mapToAuthEntity,
  toLoginDTO2,
} from "../mappers/authMapper";
import { getProfileService } from "./profileService";

dotenv.config();

export const loginUserService = async (body: LoginDTO): Promise<any> => {
  const userEntity = mapToAuthEntity(body);

  const { data, error } = await supabase.auth.signInWithPassword(userEntity);

  if (error) {
    throw new Error(`DB: ${error.message}`);
  }

  if (!data || !data.user) {
    throw new Error("Login failed, no user data returned");
  }

  const profile = await getProfileService(data.user.id);

  const user = mapToLoginDTO(data, profile);
  return user as Login;
};

// export const registerUserService = async (
//   body: RegisterDTO
// ): Promise<Login> => {
//   const userEntity = mapToAuthEntity(body);

//   const { data, error } = await supabase.auth.signUp(userEntity);

//   if (error) {
//     throw new Error(`DB: ${error.message}`);
//   }

//   if (!data || !data.user) {
//     throw new Error("User registration failed, no user data returned");
//   }

//   //! create profile for user

//   const user = mapToRegisterDTO(data);
//   return user as Register;
// };

// export const registerUser = async (
//   email: string,
//   password: string,
//   fullName: string
// ): Promise<GlobalResponse> => {
//   try {
//     const user = signUpData.user;

//     const { error: profileError } = await supabase.from("profile").insert([
//       {
//         id: user.id,
//         full_name: fullName,
//         is_premium: false,
//       },
//     ]);

//     if (profileError) {
//       throw new Error(`Profile creation failed: ${profileError.message}`);
//     }

//     const loginDTO = toLoginDTO2(signUpData, fullName);

//     return {
//       ok: true,
//       message: `User registered successfully`,
//       data: loginDTO,
//       dateTime: new Date().toISOString(),
//       detail: "User registration successful",
//     };
//   } catch (error: any) {
//     return {
//       ok: false,
//       message: "Error signing up",
//       data: null,
//       dateTime: new Date().toISOString(),
//       detail: error?.message ?? "Unknown error",
//     };
//   }
// };

export const refreshTokenService = async (
  refreshToken: string
): Promise<GlobalResponse> => {
  try {
    const response = await axios.post(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const token = response.data;
    const refreshTokenDTO = toRefreshTokenDTO(token);

    return {
      ok: true,
      message: "Token refreshed successfully",
      data: refreshTokenDTO,
      dateTime: new Date().toISOString(),
      detail: "Token refresh successful",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "Error refreshing token",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.response?.data?.msg || error.message || "Unknown error",
    };
  }
};
