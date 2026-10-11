/**
 * Marketing landing at /landing — Research Gateway (atelier).
 * Shop CTAs leave this ads host and open peplab.com.au/shop.
 */
import '@/landing/index.css';
import '@/landing/research-atelier.css';
import BrandSplash from '@/landing/components/BrandSplash';
import LandingNavigation from '@/landing/components/LandingNavigation';
import ResearchGateway from '@/landing/pages/ResearchGateway';

export default function PeplabLandingRoute() {
  return (
    <>
      <BrandSplash />
      <LandingNavigation />
      <ResearchGateway />
    </>
  );
}
