-- ============================================
-- Waxora Demo Admin Seed
-- Run this AFTER 001_initial_schema.sql and 002_rls_policies.sql
-- ============================================

-- Ensure pgcrypto is available for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the demo admin user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@waxora.com',
  crypt('WaxoraAdmin1!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Link the auth user to the admins table
INSERT INTO admins (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@waxora.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Credentials:
--   Email:    admin@waxora.com
--   Password: WaxoraAdmin1!
-- ============================================
