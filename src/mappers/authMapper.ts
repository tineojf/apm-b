import { LoginDTO } from "../models/loginDTO";

export const toLoginDTO = (sbResponse: any, sbResponse2: any): LoginDTO => {
  return {
    full_name: sbResponse2.full_name || "User",
    refresh_token: sbResponse.session.refresh_token || "",
    access_token: sbResponse.session.access_token || "",
  };
};
