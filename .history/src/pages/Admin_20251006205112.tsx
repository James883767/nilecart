import { AdminVerificationDashboard } from '@/components/AdminVerificationDashboard';
import { BannerManagement } from '@/components/BannerManagement';
import { AdminRoute } from '@/components/AdminRoute';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { homePageBanners } from '@/data/banners';
import { BannerItem } from '@/components/Banner';

const Admin = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <AdminVerificationDashboard />
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default Admin;
