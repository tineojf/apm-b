import axios from "axios";
import dotenv from "dotenv";
import { supabase } from "../utils/supabaseClient";
import { GlobalResponse } from "../models/globalResponseModel";
import { fetchProfileByUserId } from "./profileService";
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
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password }
    );

    if (signUpError) {
      throw new Error(signUpError.message);
    }
    if (!signUpData.user) {
      throw new Error("User registration failed: no user returned");
    }

    const user = signUpData.user;

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

    const userDTO = toUserDTO(user, fullName);

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
      detail: error?.message ?? "Unknown error",
    };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<GlobalResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return {
      ok: false,
      message: "Error logging in",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    };
  }

  if (!data || !data.user) {
    return {
      ok: false,
      message: "Login failed, no user data returned",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "User or session missing after login",
    };
  }

  const { profile, error: profileError } = await fetchProfileByUserId(
    data.user.id
  );

  if (profileError) {
    return {
      ok: false,
      message: "Error fetching profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: profileError.message,
    };
  }

  const loginDTO = toLoginDTO(data, profile);

  return {
    ok: true,
    message: "User logged in successfully",
    data: loginDTO,
    dateTime: new Date().toISOString(),
    detail: "User login successful",
  };
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
