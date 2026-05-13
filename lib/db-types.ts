export type MatchStatus = "pending" | "confirmed" | "disputed";
export type MatchType = "tournament" | "ranked" | "casual";
export type ClubType = "pro" | "loisir";
export type ClubRole = "admin" | "member";
export type EventType = "tournament" | "casual" | "training";
export type TournamentFormat = "round_robin" | "single_elimination" | "double_elimination";
export type TournamentStatus = "upcoming" | "ongoing" | "completed";

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

export type DbClub = {
  id: string;
  name: string;
  slug: string;
  type: ClubType;
  logo: string | null;
  description: string | null;
  color: string;
  city: string | null;
  website: string | null;
  created_by: string;
  created_at: string;
};

export type DbClubMember = {
  id: string;
  club_id: string;
  player_id: string;
  role: ClubRole;
  joined_at: string;
};

export type DbEvent = {
  id: string;
  club_id: string;
  name: string;
  description: string | null;
  type: EventType;
  date: string;
  location: string | null;
  max_participants: number | null;
  created_by: string;
  created_at: string;
};

export type DbTournament = {
  id: string;
  event_id: string;
  format: TournamentFormat;
  status: TournamentStatus;
  created_at: string;
};

export type DbTournamentParticipant = {
  id: string;
  tournament_id: string;
  player_id: string;
  seed: number | null;
};

export type DbClubLeaderboard = {
  id: string;
  name: string;
  slug: string;
  type: ClubType;
  logo: string | null;
  color: string;
  city: string | null;
  member_count: number;
  avg_rating: number;
  total_rating: number;
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
      clubs: {
        Row: DbClub;
        Insert: Omit<DbClub, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbClub, "id" | "created_at">>;
        Relationships: [];
      };
      club_members: {
        Row: DbClubMember;
        Insert: Omit<DbClubMember, "id" | "joined_at"> & {
          id?: string;
          joined_at?: string;
        };
        Update: Partial<Omit<DbClubMember, "id" | "joined_at">>;
        Relationships: [];
      };
      events: {
        Row: DbEvent;
        Insert: Omit<DbEvent, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbEvent, "id" | "created_at">>;
        Relationships: [];
      };
      tournaments: {
        Row: DbTournament;
        Insert: Omit<DbTournament, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbTournament, "id" | "created_at">>;
        Relationships: [];
      };
      tournament_participants: {
        Row: DbTournamentParticipant;
        Insert: Omit<DbTournamentParticipant, "id" | "seed"> & { id?: string; seed?: number | null };
        Update: Partial<Omit<DbTournamentParticipant, "id">>;
        Relationships: [];
      };
    };
    Views: {
      club_leaderboard: {
        Row: DbClubLeaderboard;
        Relationships: [];
      };
    };
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
