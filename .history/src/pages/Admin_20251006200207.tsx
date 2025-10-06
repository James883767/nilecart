import { AdminVerificationDashboard } from '@/components/AdminVerificationDashboard';
import { AdminRoute } from '@/components/AdminRoute';
import { Navbar } from '@/components/Navbar';

const Admin = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <AdminVerificationDashboard />
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
