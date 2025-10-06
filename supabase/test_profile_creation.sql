-- Test script to verify profile creation works
-- This script can be run in the Supabase SQL editor to test the trigger

-- First, let's check if the trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  routine_name, 
  routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check the profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if there are any existing profiles
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Check if there are any existing users
SELECT COUNT(*) as user_count FROM auth.users;

-- Test the trigger by creating a test user (this will be cleaned up automatically)
-- Note: This is just for testing - in real usage, users are created through Supabase Auth
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Create a test user
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
    raw_user_meta_data,
    raw_app_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Test User", "role": "seller"}'::jsonb,
    '{}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  ) RETURNING id INTO test_user_id;
  
  -- Check if profile was created
  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = test_user_id) THEN
    RAISE NOTICE 'SUCCESS: Profile was created for test user';
    RAISE NOTICE 'Profile details: %', (SELECT row_to_json(p) FROM public.profiles p WHERE user_id = test_user_id);
  ELSE
    RAISE NOTICE 'ERROR: Profile was NOT created for test user';
  END IF;
  
  -- Clean up test user
  DELETE FROM auth.users WHERE id = test_user_id;
  
  RAISE NOTICE 'Test completed and cleaned up';
END $$;
