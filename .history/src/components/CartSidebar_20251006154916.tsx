import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, X, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from './CartItem';
import { CheckoutDialog } from './CheckoutDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const CartSidebar = () => {
  const { items, getTotalPrice, getTotalItems, clearCart, getCartBySeller } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sellerWhatsApp, setSellerWhatsApp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cartBySeller = getCartBySeller();
  const sellerIds = Object.keys(cartBySeller);

  // Get WhatsApp number for the first seller (assuming single seller checkout for now)
  useEffect(() => {
    if (sellerIds.length > 0 && !sellerWhatsApp) {
      fetchSellerWhatsApp(sellerIds[0]);
    }
  }, [sellerIds, sellerWhatsApp]);

  const fetchSellerWhatsApp = async (sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_number')
        .eq('user_id', sellerId)
        .single();

      if (!error && data?.whatsapp_number) {
        setSellerWhatsApp(data.whatsapp_number);
      }
    } catch (error) {
      console.error('Error fetching seller WhatsApp:', error);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!sellerWhatsApp) {
      toast.error('Seller WhatsApp number not available. Please try again later.');
      return;
    }

    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    clearCart();
    setCheckoutOpen(false);
    toast.success('Order sent successfully!');
  };

  if (items.length === 0) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
            <Badge variant="secondary" className="ml-1">
              {getTotalItems()}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Add some products to get started!
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
            <Badge variant="secondary" className="ml-1">
              {getTotalItems()}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({getTotalItems()})
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <Separator />

            {/* Cart Summary */}
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Items ({getTotalItems()}):</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout} 
                  className="w-full gap-2"
                  disabled={loading || !sellerWhatsApp}
                >
                  <MessageCircle className="h-4 w-4" />
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full gap-2"
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>

              {!sellerWhatsApp && items.length > 0 && (
                <div className="text-xs text-muted-foreground text-center">
                  Loading seller information...
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        products={items}
        sellerWhatsApp={sellerWhatsApp}
        onComplete={handleCheckoutComplete}
      />
    </>
  );
};
