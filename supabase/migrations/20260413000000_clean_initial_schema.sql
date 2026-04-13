-- =========================================================
-- INITIAL CLEAN SCHEMA
-- =========================================================

-- =========================================================
-- SAFELY DROP EXISTING OBJECTS (Idempotency)
-- =========================================================

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Policies (Storage)
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product images" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload their own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own pending verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own pending verification documents" ON storage.objects;

-- Tables & Enums
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.sellers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.user_role;

-- =========================================================
-- TYPES & ENUMS
-- =========================================================
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin');

-- =========================================================
-- TABLES
-- =========================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'buyer',
  full_name TEXT,
  whatsapp_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'South Sudan',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Sellers table (Verification system)
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  passport_number TEXT NOT NULL,
  passport_image_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT false NOT NULL,
  verification_status TEXT DEFAULT 'pending' NOT NULL CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT DEFAULT 'Other',
  image_url TEXT,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_verification_status ON public.sellers(verification_status);
CREATE INDEX IF NOT EXISTS idx_sellers_verified ON public.sellers(verified);

CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- =========================================================
-- Helper Functions
-- =========================================================

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------
-- Policies: Profiles
-- ---------------------------------------------------------
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view seller contact info"
  ON public.profiles FOR SELECT
  USING (role = 'seller' OR role = 'admin');

-- ---------------------------------------------------------
-- Policies: Sellers (Verification Data)
-- ---------------------------------------------------------
CREATE POLICY "Sellers can view their own verification data"
  ON public.sellers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert their own verification data"
  ON public.sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update their own pending verification data"
  ON public.sellers FOR UPDATE
  USING (auth.uid() = user_id AND verification_status = 'pending');

CREATE POLICY "Admins can view all verification data"
  ON public.sellers FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update verification status"
  ON public.sellers FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------
-- Policies: Products
-- ---------------------------------------------------------
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = seller_id);

-- =========================================================
-- FUNCTIONS & TRIGGERS
-- =========================================================

-- ---------------------------------------------------------
-- Handle new user creation
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------
-- Trigger function for updated_at
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- STORAGE CONFIGURATION
-- =========================================================

-- ---------------------------------------------------------
-- Product Images Bucket & Policies
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );


-- ---------------------------------------------------------
-- Seller IDs Bucket & Policies
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller-ids', 'seller-ids', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own verification documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'seller-ids' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'seller-ids' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'seller-ids' AND
    public.is_admin()
  );

CREATE POLICY "Users can update their own pending verification documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'seller-ids' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM public.sellers 
      WHERE user_id = auth.uid() AND verification_status = 'pending'
    )
  );

CREATE POLICY "Users can delete their own pending verification documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'seller-ids' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM public.sellers 
      WHERE user_id = auth.uid() AND verification_status = 'pending'
    )
  );

-- Function to get signed URL for verification documents
CREATE OR REPLACE FUNCTION public.get_verification_document_url(document_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  signed_url TEXT;
BEGIN
  -- Check if user has access to this document
  IF NOT (
    -- User owns the document
    (auth.uid()::text = (storage.foldername(document_path))[1]) OR
    -- User is admin
    public.is_admin()
  ) THEN
    RAISE EXCEPTION 'Access denied to verification document';
  END IF;

  -- Get signed URL (expires in 1 hour)
  SELECT storage.create_signed_url('seller-ids', document_path, 3600) INTO signed_url;
  
  RETURN signed_url;
END;
$$;
