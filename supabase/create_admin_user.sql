-- =========================================================
-- CREATE ADMIN USER SCRIPT
-- =========================================================
-- This script helps you create an admin user for testing
-- Run this in your Supabase SQL Editor after creating a user account

-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from auth.users
-- You can find the user ID in the Supabase Auth dashboard

-- Example usage:
-- 1. Create a user account through your app's signup process
-- 2. Go to Supabase Auth dashboard and copy the user ID
-- 3. Replace 'YOUR_USER_ID_HERE' below with that user ID
-- 4. Run this script in Supabase SQL Editor

UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Verify the update
SELECT 
  p.user_id,
  p.role,
  p.full_name,
  au.email
FROM public.profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.role = 'admin';
