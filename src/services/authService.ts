import axios from "axios";
import { supabase } from "../utils/supabaseClient";
import { User, UserDTO } from "../models/userModel";
import { GlobalResponse } from "../models/globalResponseModel";
import dotenv from "dotenv";
import { LoginDTO } from "../models/loginDTO";

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
    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      full_name: fullName,
      is_premium: false,
    };

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

    const loginDTO: LoginDTO = {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      expires_in: user.expires_in,
      expires_at: user.expires_at,
      token_type: user.token_type,
      user: {
        id: user.user.id,
        email: user.user.email,
        email_confirmed_at: user.user.email_confirmed_at,
      },
    };

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
