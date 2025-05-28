import { UserDTO } from "../models/userModel";

export const toUserDTO = (
  supabaseResponse: any,
  full_name: string
): UserDTO => {
  return {
    id: supabaseResponse.id,
    email: supabaseResponse.email,
    created_at: supabaseResponse.created_at,
    full_name: full_name,
    is_premium: supabaseResponse.is_premium,
  };
};
