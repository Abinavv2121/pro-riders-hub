-- Run this in the Supabase SQL Editor to create the tables

-- Create enquiries table
CREATE TABLE enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamp with time zone,
  status text DEFAULT 'pending'
);

-- Note: We don't need a table for admin login as we are using a simple dashboard with hard-coded password. 
-- The portal doesn't require Supabase auth or an accounts table based on your instructions.
