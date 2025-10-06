import { StaticBanner } from './Banner';
import { categoryBanners } from '@/data/banners';

interface CategoryBannerProps {
  category: string;
  className?: string;
}

export const CategoryBanner = ({ category, className }: CategoryBannerProps) => {
  const banners = categoryBanners[category.toLowerCase()];
  
  if (!banners || banners.length === 0) {
    return null;
  }

  const banner = banners[0]; // Use the first banner for the category

  return (
    <StaticBanner
      image={banner.image}
      title={banner.title}
      subtitle={banner.subtitle}
      buttonText={banner.buttonText}
      buttonLink={banner.buttonLink}
      overlay={banner.overlay}
      textPosition={banner.textPosition}
      height="h-48 md:h-64"
      className={className}
    />
  );
};
