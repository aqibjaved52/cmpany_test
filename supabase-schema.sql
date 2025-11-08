-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  business_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for admin use)
-- In production, you should restrict this based on authentication

-- Policy for SELECT (reading)
CREATE POLICY "Allow select for all users" ON clients
  FOR SELECT
  USING (true);

-- Policy for INSERT (creating)
CREATE POLICY "Allow insert for all users" ON clients
  FOR INSERT
  WITH CHECK (true);

-- Policy for UPDATE (updating)
CREATE POLICY "Allow update for all users" ON clients
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy for DELETE (deleting)
CREATE POLICY "Allow delete for all users" ON clients
  FOR DELETE
  USING (true);

