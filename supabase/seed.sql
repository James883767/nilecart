-- Enable pgcrypto for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert a default Admin User into auth.users
-- This uses a fixed UUID so we can reference it, and a hardcoded password 'admin123'
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Fixed UUID
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@nilecart.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Admin","role":"admin"}', -- Notice we set role to 'admin' right here!
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Since we added the 'on_auth_user_created' trigger in the migration, 
-- inserting exactly into `auth.users` will automatically fire the trigger, 
-- read `"role":"admin"`, and create the admin profile for this user in public.profiles!
