# Database Migration Instructions

## Apply the New Database Schema

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Copy the contents of `supabase/migrations/20250106000001_clean_database_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Test the Setup** (Optional)
   - Copy the contents of `supabase/test_profile_creation.sql`
   - Paste it into the SQL Editor
   - Click "Run" to test if the trigger works

## What This Migration Does

- **Drops and recreates** all tables with a clean schema
- **Creates a robust trigger** that creates profiles when users sign up
- **Adds proper error handling** so user creation doesn't fail if profile creation fails
- **Creates all necessary indexes** for better performance
- **Sets up proper RLS policies** for security
- **Creates storage bucket** for product images

## Key Improvements

1. **Better Error Handling**: The trigger won't fail user creation if profile creation fails
2. **Default Values**: Profiles get default values if metadata is missing
3. **Proper Indexes**: Better query performance
4. **Clean Schema**: No leftover data or conflicting constraints
5. **Updated Timestamps**: Automatic tracking of when records are modified

## After Migration

1. Test user registration with both buyer and seller roles
2. Verify that profiles are created automatically
3. Check that role-based routing works correctly
4. Test product creation and management

The new schema should resolve any issues with profile creation and role-based authentication.
