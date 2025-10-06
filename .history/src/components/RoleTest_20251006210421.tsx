import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const RoleTest = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Role Access Test</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs">
          <div>
            <strong>User:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> <Badge variant="outline">{profile.role}</Badge>
          </div>
          <div>
            <strong>Can access:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Home: {['buyer', 'seller', 'admin'].includes(profile.role) ? '✅' : '❌'}</li>
              <li>• Dashboard: {profile.role === 'seller' ? '✅' : '❌'}</li>
              <li>• Admin: {profile.role === 'admin' ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
