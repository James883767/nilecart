# Seller Verification System

A comprehensive seller verification feature for your e-commerce MVP built with Supabase.

## Features

### For Sellers
- **Verification Form**: Clean interface to upload passport documents and enter passport number
- **Status Tracking**: Real-time verification status display in seller dashboard
- **Document Upload**: Secure file upload with image/PDF support (max 5MB)
- **Business Name**: Optional business name field for registered businesses

### For Admins
- **Verification Dashboard**: Complete admin interface to review seller verifications
- **Document Viewer**: Secure document viewing with signed URLs
- **Approval/Rejection**: One-click approve or reject functionality
- **Status Management**: Track pending, approved, and rejected verifications
- **Statistics**: Overview of verification metrics

## Security Features

- **Private Storage**: All verification documents stored in private Supabase bucket
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Signed URLs**: Secure document access with time-limited URLs
- **Admin-Only Access**: Verification dashboard restricted to admin users
- **Data Encryption**: Sensitive passport data protected at rest

## Database Schema

### Sellers Table
```sql
CREATE TABLE public.sellers (
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
```

### Storage Bucket
- **Bucket Name**: `seller-ids`
- **Privacy**: Private (not public)
- **File Organization**: Files stored in `verification/{user_id}/` folders

## Setup Instructions

### 1. Apply Database Migration
Run the migration file in your Supabase project:
```sql
-- Run: supabase/migrations/20250106000003_seller_verification_system.sql
```

### 2. Create Admin User
1. Sign up a regular user account through your app
2. Go to Supabase Auth dashboard and copy the user ID
3. Run the admin creation script:
```sql
-- Update supabase/create_admin_user.sql with your user ID
-- Then run it in Supabase SQL Editor
```

### 3. Test the System
1. **As a Seller**:
   - Go to `/dashboard`
   - Click "Verify Now" to open verification form
   - Upload passport document and enter passport number
   - Submit verification request

2. **As an Admin**:
   - Go to `/admin`
   - View pending verifications
   - Click "View Document" to review passport
   - Approve or reject verification

## File Structure

```
src/
├── components/
│   ├── SellerVerificationForm.tsx    # Verification form for sellers
│   ├── AdminVerificationDashboard.tsx # Admin dashboard
│   └── AdminRoute.tsx                # Admin access protection
├── pages/
│   ├── Admin.tsx                     # Admin page
│   └── Dashboard.tsx                 # Updated with verification status
└── supabase/
    ├── migrations/
    │   └── 20250106000003_seller_verification_system.sql
    └── create_admin_user.sql
```

## API Endpoints

### Seller Verification
- **POST** `/sellers` - Submit verification
- **GET** `/sellers?user_id=eq.{user_id}` - Get seller's verification status
- **PUT** `/sellers?id=eq.{id}` - Update verification (sellers can only update pending)

### Admin Operations
- **GET** `/sellers` - Get all verifications (admin only)
- **PUT** `/sellers?id=eq.{id}` - Update verification status (admin only)

### Storage
- **POST** `/storage/v1/object/seller-ids/{path}` - Upload document
- **GET** `/storage/v1/object/seller-ids/{path}` - Get signed URL for document

## Security Policies

### Row Level Security (RLS)
- Sellers can only view/update their own verification data
- Admins can view and update all verification data
- Document access restricted to owner and admins
- Signed URLs expire after 1 hour

### File Upload Security
- File type validation (images and PDFs only)
- File size limit (5MB maximum)
- User-specific folder structure
- Private bucket access only

## Usage Examples

### Check Verification Status
```typescript
const { data, error } = await supabase
  .from('sellers')
  .select('verified, verification_status')
  .eq('user_id', user.id)
  .single();
```

### Upload Verification Document
```typescript
const { error } = await supabase.storage
  .from('seller-ids')
  .upload(`verification/${userId}/${fileName}`, file);
```

### Get Signed URL for Document
```typescript
const { data } = await supabase.storage
  .from('seller-ids')
  .createSignedUrl(filePath, 3600); // 1 hour expiry
```

## Troubleshooting

### Common Issues

1. **"Access denied" errors**
   - Check RLS policies are properly applied
   - Verify user has correct role permissions

2. **File upload failures**
   - Ensure file is under 5MB
   - Check file type is image or PDF
   - Verify storage bucket exists and is private

3. **Admin dashboard not accessible**
   - Confirm user has 'admin' role in profiles table
   - Check AdminRoute component is working correctly

4. **Document not loading**
   - Verify signed URL generation
   - Check file path is correct
   - Ensure document exists in storage

### Debug Steps

1. Check Supabase logs for RLS policy violations
2. Verify user roles in profiles table
3. Test file uploads in Supabase storage dashboard
4. Check browser console for client-side errors

## Future Enhancements

- **Email Notifications**: Notify sellers of verification status changes
- **Document Validation**: AI-powered document authenticity checking
- **Bulk Operations**: Admin ability to approve/reject multiple verifications
- **Audit Log**: Track all verification status changes
- **Advanced Security**: Document watermarking and encryption
- **Mobile Optimization**: Enhanced mobile experience for document upload

## Support

For issues or questions about the verification system:
1. Check the troubleshooting section above
2. Review Supabase logs for errors
3. Verify all migrations have been applied correctly
4. Test with a fresh user account to isolate issues
