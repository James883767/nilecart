-- =========================================================
-- SIMPLE ADMIN ENUM FIX
-- =========================================================

-- Try to add admin value to existing enum
-- If it already exists, this will be ignored
DO $$ 
BEGIN
    -- Try to add the admin value
    BEGIN
        ALTER TYPE public.user_role ADD VALUE 'admin';
    EXCEPTION
        WHEN duplicate_object THEN
            -- Value already exists, ignore the error
            NULL;
    END;
END $$;

-- Now create the sellers table (without the admin role references first)
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

-- Enable RLS on sellers table
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_verification_status ON public.sellers(verification_status);
CREATE INDEX IF NOT EXISTS idx_sellers_verified ON public.sellers(verified);

-- RLS Policies for sellers table
-- Sellers can view their own verification data
CREATE POLICY "Sellers can view their own verification data"
  ON public.sellers FOR SELECT
  USING (auth.uid() = user_id);

-- Sellers can insert their own verification data
CREATE POLICY "Sellers can insert their own verification data"
  ON public.sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sellers can update their own verification data (only if pending)
CREATE POLICY "Sellers can update their own pending verification data"
  ON public.sellers FOR UPDATE
  USING (auth.uid() = user_id AND verification_status = 'pending');

-- Admins can view all verification data
CREATE POLICY "Admins can view all verification data"
  ON public.sellers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update verification status
CREATE POLICY "Admins can update verification status"
  ON public.sellers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger for sellers table
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- STORAGE CONFIGURATION
-- =========================================================

-- Create private storage bucket for seller verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller-ids', 'seller-ids', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for seller-ids bucket
-- Only authenticated users can upload to their own folder
CREATE POLICY "Users can upload their own verification documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'seller-ids' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own verification documents
CREATE POLICY "Users can view their own verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'seller-ids' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can view all verification documents
CREATE POLICY "Admins can view all verification documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'seller-ids' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own verification documents (only if pending)
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

-- Users can delete their own verification documents (only if pending)
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

-- =========================================================
-- HELPER FUNCTIONS
-- =========================================================

-- Create function to check if user is admin
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
