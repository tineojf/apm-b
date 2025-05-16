import { UserDTO } from "../models/userModel";

export const toUserDTO = (supabaseResponse: any): UserDTO => {
  return {
    id: supabaseResponse.id,
    email: supabaseResponse.email,
    created_at: supabaseResponse.created_at,
    full_name: supabaseResponse.full_name,
    is_premium: supabaseResponse.is_premium,
  };
};
