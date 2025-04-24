/*
  # Create Feedback Application Schema

  1. New Schema
    - Creates a dedicated 'feedback' schema for the application
    
  2. New Tables (all within feedback schema)
    - `questions` - Stores all survey questions
    - `responses` - Stores all feedback responses
    
  3. Security
    - Enable RLS on both tables
    - Schema-level permissions for authenticated users
    - Table-level policies for specific operations
*/

-- Create new schema
CREATE SCHEMA IF NOT EXISTS feedback;

-- Create questions table in feedback schema
CREATE TABLE IF NOT EXISTS feedback.questions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question_text TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Create responses table in feedback schema
CREATE TABLE IF NOT EXISTS feedback.responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  question_id INTEGER REFERENCES feedback.questions(id) ON DELETE CASCADE,
  is_happy BOOLEAN NOT NULL
);

-- Enable RLS
ALTER TABLE feedback.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback.responses ENABLE ROW LEVEL SECURITY;

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA feedback TO authenticated;
GRANT USAGE ON SCHEMA feedback TO anon;

-- Grant table permissions
GRANT SELECT ON feedback.questions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON feedback.questions TO authenticated;
GRANT SELECT ON feedback.responses TO authenticated;
GRANT INSERT ON feedback.responses TO anon;

-- Grant sequence usage
GRANT USAGE ON ALL SEQUENCES IN SCHEMA feedback TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA feedback TO anon;

-- RLS Policies for questions
CREATE POLICY "Authenticated users can manage questions"
  ON feedback.questions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can read active questions"
  ON feedback.questions
  FOR SELECT
  TO anon
  USING (active = true);

-- RLS Policies for responses
CREATE POLICY "Anonymous users can submit responses"
  ON feedback.responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view responses"
  ON feedback.responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample question
INSERT INTO feedback.questions (question_text, active)
VALUES ('How satisfied are you with our service today?', true);