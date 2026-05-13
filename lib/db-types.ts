export type MatchStatus = "pending" | "confirmed" | "disputed";
export type MatchType = "tournament" | "ranked" | "casual";

export type SetDetail = { a: number; b: number };

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
  match_type: MatchType;
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

// Structure complète requise par @supabase/supabase-js pour que le générique
// Database soit accepté sans se réduire à `never`.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbProfile, "id" | "created_at">>;
        Relationships: [];
      };
      matches: {
        Row: DbMatch;
        // Les champs remplis par confirm_match() sont optionnels à l'insert
        Insert: Omit<
          DbMatch,
          | "id"
          | "created_at"
          | "winner_id"
          | "rating_a_before"
          | "rating_b_before"
          | "rating_a_after"
          | "rating_b_after"
          | "rating_delta"
          | "confirmed_at"
        > & {
          id?: string;
          created_at?: string;
          winner_id?: string | null;
          rating_a_before?: number | null;
          rating_b_before?: number | null;
          rating_a_after?: number | null;
          rating_b_after?: number | null;
          rating_delta?: number | null;
          confirmed_at?: string | null;
        };
        Update: Partial<Omit<DbMatch, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      confirm_match: {
        Args: { match_id: string };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
