import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller' | 'admin')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Check role-based access
    if (!loading && user && profile && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(profile.role as 'buyer' | 'seller' | 'admin')) {
        // Redirect based on user role
        if (profile.role === 'buyer') {
          navigate('/home');
        } else if (profile.role === 'seller') {
          navigate('/dashboard');
        } else if (profile.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        return;
      }
    }
  }, [user, profile, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check if user has the required role
  if (allowedRoles && allowedRoles.length > 0 && profile) {
    if (!allowedRoles.includes(profile.role as 'buyer' | 'seller' | 'admin')) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. You don't have permission to view this page.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
};