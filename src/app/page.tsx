import { HeroSection } from '@/app/components/HeroSection';
import { ProductCarousel } from '@/app/components/ProductCarousel';
import { CommunitySection } from '@/app/components/CommunitySection';
import { FeaturedBanner } from '@/app/components/FeaturedBanner';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductCarousel />
      <FeaturedBanner />
      <CommunitySection />
    </main>
  );
}
