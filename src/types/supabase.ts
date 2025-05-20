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
