/*
  # Create user_profiles table

  ## Summary
  Creates a user_profiles table to store onboarding registration data for each authenticated user.

  ## New Tables
  - `user_profiles`
    - `id` (uuid, primary key) - references auth.users(id)
    - `email` (text, nullable) - user's email address
    - `phone` (text, nullable) - user's phone number (for OTP users)
    - `pseudo` (text, nullable) - chosen username/display name
    - `birth_date` (date, nullable) - date of birth from onboarding
    - `gender` (text, nullable) - gender from onboarding
    - `native_language` (text, nullable) - user's native language code
    - `target_language` (text, nullable) - language the user wants to learn
    - `level` (text, nullable) - self-assessed proficiency level (Débutant/Intermédiaire/Avancé)
    - `interests` (text[], default '{}') - array of interest categories
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

  ## Security
  - RLS enabled on `user_profiles`
  - SELECT policy: authenticated users can only read their own profile
  - INSERT policy: authenticated users can only insert their own profile
  - UPDATE policy: authenticated users can only update their own profile

  ## Notes
  1. The `id` column is a foreign key to auth.users, ensuring profiles are tied to authenticated accounts
  2. RLS policies use auth.uid() to enforce ownership
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  pseudo text,
  birth_date date,
  gender text,
  native_language text,
  target_language text,
  level text,
  interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);
