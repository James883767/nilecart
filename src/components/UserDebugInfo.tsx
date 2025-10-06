import { useAuth } from '@/contexts/AuthContext';

export const UserDebugInfo = () => {
  const { user, profile } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <div><strong>User ID:</strong> {user.id}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {profile?.role || 'Unknown'}</div>
      <div><strong>Full Name:</strong> {profile?.full_name || 'Not set'}</div>
    </div>
  );
};
