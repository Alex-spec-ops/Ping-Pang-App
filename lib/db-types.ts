export type MatchStatus = "pending" | "confirmed" | "disputed";

export type DbProfile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar: string | null;
  rating: number;
  matches_played: number;
  matches_won: number;
  created_at: string;
};

export type DbMatch = {
  id: string;
  player_a_id: string;
  player_b_id: string;
  winner_id: string | null;
  score_a: number;
  score_b: number;
  set_scores: SetDetail[] | null;
  status: MatchStatus;
  submitted_by: string;
  rating_a_before: number | null;
  rating_b_before: number | null;
  rating_a_after: number | null;
  rating_b_after: number | null;
  rating_delta: number | null;
  played_at: string;
  confirmed_at: string | null;
  created_at: string;
};

export type SetDetail = { a: number; b: number };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, "created_at"> & { created_at?: string };
        Update: Partial<DbProfile>;
      };
      matches: {
        Row: DbMatch;
        Insert: Omit<DbMatch, "created_at"> & { created_at?: string };
        Update: Partial<DbMatch>;
      };
    };
    Functions: {
      confirm_match: {
        Args: { match_id: string };
        Returns: void;
      };
    };
  };
};
