import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CATEGORIES } from './CategoryFilter';
import { ImageUpload } from './ImageUpload';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  seller_id: string;
}

interface ProductFormProps {
  onSuccess: () => void;
  product?: Product | null;
  isEditing?: boolean;
}

export const ProductForm = ({ onSuccess, product, isEditing = false }: ProductFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Other',
  });
  const [imageUrl, setImageUrl] = useState<string>('');

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
      });
      setImageUrl(product.image_url || '');
    }
  }, [isEditing, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl || null,
        seller_id: user.id,
      };

      if (isEditing && product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) throw updateError;
        toast.success('Product updated successfully!');
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert(productData);

        if (insertError) throw insertError;
        toast.success('Product added successfully!');
      }

      // Reset form
      setFormData({ name: '', description: '', price: '', category: 'Other' });
      setImageUrl('');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (SSP)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter(cat => cat !== 'All').map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder="products"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};