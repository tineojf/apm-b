export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserDTO {
  id: string;
  email: string;
  created_at: string;
  full_name: string;
  is_premium: boolean;
}
