-- Fix RLS policy to allow buyers to read seller contact information
-- This allows buyers to access seller WhatsApp numbers for checkout

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Create a new policy that allows anyone to view seller contact information
-- This is needed for buyers to access seller WhatsApp numbers during checkout
CREATE POLICY "Anyone can view seller contact info"
  ON public.profiles FOR SELECT
  USING (role = 'seller');

-- Note: This policy allows anyone to read seller profiles, but only sellers
-- can read buyer profiles. This is the intended behavior for a marketplace
-- where buyers need to contact sellers but sellers don't need to see buyer details.
