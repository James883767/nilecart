import { BannerItem } from '@/components/Banner';

// Sample banner data - you can replace these with your own images and content
export const homePageBanners: BannerItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Welcome to NileCart',
    subtitle: 'South Sudan\'s premier online marketplace connecting buyers and sellers',
    buttonText: 'Start Shopping',
    buttonLink: '/home',
    overlay: 'dark',
    textPosition: 'center'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Verified Sellers',
    subtitle: 'Shop with confidence from verified local sellers across South Sudan',
    buttonText: 'Browse Products',
    buttonLink: '/home',
    overlay: 'dark',
    textPosition: 'left'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Become a Seller',
    subtitle: 'Join thousands of successful sellers and grow your business with us',
    buttonText: 'Start Selling',
    buttonLink: '/auth?mode=signup',
    overlay: 'dark',
    textPosition: 'right'
  }
];

export const landingPageBanners: BannerItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Welcome to NileCart',
    subtitle: 'South Sudan\'s trusted marketplace for buying and selling',
    buttonText: 'Get Started',
    buttonLink: '/auth?mode=signup',
    overlay: 'dark',
    textPosition: 'center'
  }
];

// Category-specific banners
export const categoryBanners: Record<string, BannerItem[]> = {
  electronics: [
    {
      id: 'electronics-1',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Latest Electronics',
      subtitle: 'Discover the newest gadgets and electronics from local sellers',
      buttonText: 'Shop Electronics',
      buttonLink: '/home?category=electronics',
      overlay: 'dark',
      textPosition: 'center'
    }
  ],
  clothing: [
    {
      id: 'clothing-1',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Fashion & Clothing',
      subtitle: 'Find the latest fashion trends and traditional wear',
      buttonText: 'Shop Fashion',
      buttonLink: '/home?category=clothing',
      overlay: 'dark',
      textPosition: 'center'
    }
  ],
  home: [
    {
      id: 'home-1',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Home & Garden',
      subtitle: 'Transform your home with quality furniture and decor',
      buttonText: 'Shop Home',
      buttonLink: '/home?category=home',
      overlay: 'dark',
      textPosition: 'center'
    }
  ]
};
