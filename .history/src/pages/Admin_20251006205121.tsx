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
  const [banners, setBanners] = useState<BannerItem[]>(homePageBanners);

  const handleBannerAdd = (banner: BannerItem) => {
    setBanners(prev => [...prev, banner]);
  };

  const handleBannerEdit = (id: string, updatedBanner: BannerItem) => {
    setBanners(prev => prev.map(banner => banner.id === id ? updatedBanner : banner));
  };

  const handleBannerDelete = (id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="verifications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="verifications">Seller Verifications</TabsTrigger>
              <TabsTrigger value="banners">Banner Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="verifications">
              <AdminVerificationDashboard />
            </TabsContent>
            
            <TabsContent value="banners">
              <BannerManagement
                banners={banners}
                onBannerAdd={handleBannerAdd}
                onBannerEdit={handleBannerEdit}
                onBannerDelete={handleBannerDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default Admin;
