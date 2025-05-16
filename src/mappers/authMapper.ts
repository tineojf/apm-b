import { LoginDTO } from "../models/loginDTO";

export const toLoginDTO = (supabaseResponse: any): LoginDTO => {
  return {
    access_token: supabaseResponse.access_token,
    refresh_token: supabaseResponse.refresh_token,
    expires_in: supabaseResponse.expires_in,
    expires_at: supabaseResponse.expires_at,
    token_type: supabaseResponse.token_type,
    user: {
      id: supabaseResponse.user.id,
      email: supabaseResponse.user.email,
      email_confirmed_at: supabaseResponse.user.email_confirmed_at,
    },
  };
};
