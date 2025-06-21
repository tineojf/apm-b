import { LoginDTO } from "../models/loginDTO";
import { Profile } from "../types/supabase";
import { LoginInput } from "../validators/auth/authValidator";

export const toLoginDTO2 = (sbResponse: any, fullName: string): LoginDTO => {
  return {
    full_name: fullName || "User",
    refresh_token: sbResponse.session.refresh_token || "",
    access_token: sbResponse.session.access_token || "",
  };
};

type LoginEntity = {
  user: {
    id: string;
    email?: string;
  };
  session: {
    refresh_token: string;
    access_token: string;
  };
};

type RegisterEntity = {
  user?: {
    id?: string;
    email?: string;
  } | null;
  session: {
    refresh_token?: string;
    access_token?: string;
  } | null;
};

export function mapToAuthEntity(body: LoginInput) {
  return {
    email: body.email,
    password: body.password,
  };
}

export function mapToLoginDTO(authResponse: LoginEntity, profile: Profile) {
  return {
    full_name: profile.full_name || "User not provided",
    refresh_token: authResponse.session.refresh_token || "Not provided",
    access_token: authResponse.session.access_token || "Not provided",
  };
}

export function mapToRegisterDTO(
  authResponse: RegisterEntity,
  profile: Profile
) {
  return {
    full_name: profile.full_name || "User not provided",
    refresh_token: authResponse.session?.refresh_token || "Not provided",
    access_token: authResponse.session?.access_token || "Not provided",
  };
}
