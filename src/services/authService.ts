import axios from "axios";
import { supabase } from "../utils/supabaseClient";
import { User, UserDTO } from "../models/userModel";
import { GlobalResponse } from "../models/globalResponseModel";
import dotenv from "dotenv";
import { LoginDTO } from "../models/loginDTO";
import { toLoginDTO } from "../mappers/authMapper";
import { toRefreshTokenDTO } from "../mappers/tokenMapper";
import { toUserDTO } from "../mappers/userMapper";

dotenv.config();

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<GlobalResponse> => {
  try {
    const response = await axios.post<User>(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users`,
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const user = response.data;
    if (!user) {
      throw new Error("User registration failed: no user data returned");
    }

    // Insert user into the profile table
    const { error: profileError } = await supabase.from("profile").insert([
      {
        id: user.id,
        full_name: fullName,
        is_premium: false,
      },
    ]);
    if (profileError) {
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    // Create a user DTO
    const userDTO = toUserDTO(user);

    return {
      ok: true,
      message: "User registered successfully",
      data: userDTO,
      dateTime: new Date().toISOString(),
      detail: "User registration successful",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "Error signing up",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.response?.data?.msg ?? error.message ?? "Unknown error",
    };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<GlobalResponse> => {
  try {
    const response = await axios.post<LoginDTO>(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const user = response.data;
    const loginDTO = toLoginDTO(user);

    return {
      ok: true,
      message: "User logged in successfully",
      data: loginDTO,
      dateTime: new Date().toISOString(),
      detail: "User login successful",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "Error logging in",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.response?.data?.msg || error.message || "Unknown error",
    };
  }
};

export const refreshToken = async (
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
