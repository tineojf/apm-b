export interface UserStreak {
  id: string;
  user_id: string;
  created_at?: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string;
  updated_at: string;
  remaining_lives: number;
  last_lives_reset: string;
}

export interface StreakActivity {
  id: string;
  created_at: string;
  user_id: string;
  completed_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  is_premium: boolean;
  created_at?: string;
}

export interface Login {
  full_name: string;
  refresh_token: string;
  access_token: string;
}

export interface Register {
  // full_name: string;
  refresh_token: string;
  access_token: string;
}
