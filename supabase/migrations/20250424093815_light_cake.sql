/*
  # Initial Schema Setup for Simon Maree Feedback System

  1. New Tables
    - `questions` - Stores all survey questions
      - `id` (integer, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `question_text` (text, required)
      - `active` (boolean, default true)
    
    - `responses` - Stores all feedback responses
      - `id` (integer, primary key, auto-increment)
      - `created_at` (timestamp with timezone, default now())
      - `question_id` (integer, references questions.id)
      - `is_happy` (boolean) - true for happy/green, false for sad/red

  2. Security
    - Enable Row Level Security (RLS) on both tables
    - Only authenticated users can manage questions
    - Anonymous users can submit responses but can't view other responses
    - Authenticated users can view all responses (for analytics)
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question_text TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  is_happy BOOLEAN NOT NULL
);

-- Enable RLS on tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions table
CREATE POLICY "Authenticated users can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can read active questions"
  ON questions
  FOR SELECT
  TO anon
  USING (active = true);

CREATE POLICY "Authenticated users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for responses table
CREATE POLICY "Anonymous users can submit responses"
  ON responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all responses"
  ON responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample question
INSERT INTO questions (question_text, active)
VALUES ('How satisfied are you with our service today?', true);