import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlay?: 'light' | 'dark' | 'none';
  textPosition?: 'left' | 'center' | 'right';
}

interface BannerProps {
  items: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  height?: string;
}

export const Banner = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className,
  height = 'h-64 md:h-80 lg:h-96'
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useState(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  });

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  const getTextPosition = () => {
    switch (currentItem.textPosition) {
      case 'left':
        return 'text-left items-start';
      case 'right':
        return 'text-right items-end';
      case 'center':
      default:
        return 'text-center items-center';
    }
  };

  const getOverlayClass = () => {
    switch (currentItem.overlay) {
      case 'light':
        return 'bg-white/20';
      case 'dark':
        return 'bg-black/40';
      case 'none':
      default:
        return 'bg-black/20';
    }
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', height, className)}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentItem.image})` }}
      />
      
      {/* Overlay */}
      <div className={cn('absolute inset-0', getOverlayClass())} />
      
      {/* Content */}
      <div className={cn(
        'relative z-10 h-full flex flex-col justify-center p-6 md:p-12',
        getTextPosition()
      )}>
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {currentItem.title}
          </h2>
          {currentItem.subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6">
              {currentItem.subtitle}
            </p>
          )}
          {currentItem.buttonText && currentItem.buttonLink && (
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
              asChild
            >
              <a href={currentItem.buttonLink}>
                {currentItem.buttonText}
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Static Banner Component (for single banners)
interface StaticBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlay?: 'light' | 'dark' | 'none';
  textPosition?: 'left' | 'center' | 'right';
  className?: string;
  height?: string;
}

export const StaticBanner = ({
  image,
  title,
  subtitle,
  buttonText,
  buttonLink,
  overlay = 'dark',
  textPosition = 'center',
  className,
  height = 'h-64 md:h-80'
}: StaticBannerProps) => {
  const getTextPosition = () => {
    switch (textPosition) {
      case 'left':
        return 'text-left items-start';
      case 'right':
        return 'text-right items-end';
      case 'center':
      default:
        return 'text-center items-center';
    }
  };

  const getOverlayClass = () => {
    switch (overlay) {
      case 'light':
        return 'bg-white/20';
      case 'dark':
        return 'bg-black/40';
      case 'none':
      default:
        return 'bg-black/20';
    }
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', height, className)}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Overlay */}
      <div className={cn('absolute inset-0', getOverlayClass())} />
      
      {/* Content */}
      <div className={cn(
        'relative z-10 h-full flex flex-col justify-center p-6 md:p-12',
        getTextPosition()
      )}>
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6">
              {subtitle}
            </p>
          )}
          {buttonText && buttonLink && (
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
              asChild
            >
              <a href={buttonLink}>
                {buttonText}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
