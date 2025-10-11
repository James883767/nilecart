import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { BannerItem } from './Banner';
import { ImageUpload } from './ImageUpload';

interface BannerManagementProps {
  banners: BannerItem[];
  onBannerAdd: (banner: BannerItem) => void;
  onBannerEdit: (id: string, banner: BannerItem) => void;
  onBannerDelete: (id: string) => void;
}

export const BannerManagement = ({ 
  banners, 
  onBannerAdd, 
  onBannerEdit, 
  onBannerDelete 
}: BannerManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BannerItem>>({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    overlay: 'dark',
    textPosition: 'center'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      return;
    }

    const bannerData: BannerItem = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      subtitle: formData.subtitle || '',
      image: formData.image,
      buttonText: formData.buttonText || '',
      buttonLink: formData.buttonLink || '',
      overlay: formData.overlay || 'dark',
      textPosition: formData.textPosition || 'center'
    };

    if (editingId) {
      onBannerEdit(editingId, bannerData);
      setEditingId(null);
    } else {
      onBannerAdd(bannerData);
    }

    setFormData({
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      overlay: 'dark',
      textPosition: 'center'
    });
    setIsAdding(false);
  };

  const handleEdit = (banner: BannerItem) => {
    setFormData(banner);
    setEditingId(banner.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      overlay: 'dark',
      textPosition: 'center'
    });
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Banner Management</h2>
          <p className="text-muted-foreground">Manage promotional banners for your marketplace</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
            <CardDescription>
              Create a new promotional banner for your marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Banner title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    folder="banners"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Banner subtitle or description"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Shop Now"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    placeholder="/home"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overlay">Overlay</Label>
                  <Select
                    value={formData.overlay}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, overlay: value as 'light' | 'dark' | 'none' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textPosition">Text Position</Label>
                  <Select
                    value={formData.textPosition}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, textPosition: value as 'left' | 'center' | 'right' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update Banner' : 'Add Banner'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-0">
              <div className="relative h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${banner.image})` }}>
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-semibold text-sm line-clamp-1">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-white/80 text-xs line-clamp-1">{banner.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(banner)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBannerDelete(banner.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No banners created yet</p>
        </div>
      )}
    </div>
  );
};
