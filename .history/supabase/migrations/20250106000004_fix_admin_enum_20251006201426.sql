-- =========================================================
-- FIX ADMIN ENUM ISSUE
-- =========================================================

-- First, let's check if the enum already has 'admin' value
-- If not, we'll add it properly

-- Drop and recreate the enum with all values
-- This is safer than trying to add values to existing enum

-- First, create a new enum with all values
CREATE TYPE public.user_role_new AS ENUM ('buyer', 'seller', 'admin');

-- Update the profiles table to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.user_role_new 
USING role::text::public.user_role_new;

-- Drop the old enum
DROP TYPE public.user_role;

-- Rename the new enum to the original name
ALTER TYPE public.user_role_new RENAME TO user_role;

-- Now we can safely use 'admin' in our policies and functions
