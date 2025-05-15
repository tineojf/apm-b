import axios from "axios";
import { supabase } from "../utils/supabaseClient";
import { User, UserDTO } from "../models/userModel";
import { GlobalResponse } from "../models/globalResponseModel";
import dotenv from "dotenv";

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
      return {
        ok: false,
        message: "User not found",
        data: null,
        dateTime: new Date().toLocaleDateString(),
        detail: "User registration failed",
      };
    }

    const { error: profileError } = await supabase.from("profile").insert([
      {
        id: user.id,
        full_name: fullName,
        is_premium: false,
      },
    ]);
    if (profileError) {
      return {
        ok: false,
        message: "Profile creation failed",
        data: null,
        dateTime: new Date().toISOString(),
        detail: profileError.message,
      };
    }

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
      detail: error?.response?.data?.msg || error.message || "Unknown error",
    };
  }
};
