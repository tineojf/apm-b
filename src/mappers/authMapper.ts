import { LoginDTO } from "../models/loginDTO";

export const toLoginDTO2 = (sbResponse: any, fullName: string): LoginDTO => {
  return {
    full_name: fullName || "User",
    refresh_token: sbResponse.session.refresh_token || "",
    access_token: sbResponse.session.access_token || "",
  };
};

type AuthInput = {
  email: string;
  password: string;
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
  session: {
    refresh_token?: string;
    access_token?: string;
  };
};

export function mapToAuthEntity(body: AuthInput) {
  return {
    email: body.email,
    password: body.password,
  };
}

export function mapToLoginDTO(authResponse: LoginEntity) {
  return {
    refresh_token: authResponse.session.refresh_token || "Not provided",
    access_token: authResponse.session.access_token || "Not provided",
  };
}

export function mapToRegisterDTO(authResponse: RegisterEntity) {
  return {
    refresh_token: authResponse.session.refresh_token || "Not provided",
    access_token: authResponse.session.access_token || "Not provided",
  };
}
