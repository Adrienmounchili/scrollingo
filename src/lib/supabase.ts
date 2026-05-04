import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  pseudo: string | null;
  birth_date: string | null;
  gender: string | null;
  native_language: string | null;
  target_language: string | null;
  level: string | null;
  interests: string[];
  created_at: string;
  updated_at: string;
};
