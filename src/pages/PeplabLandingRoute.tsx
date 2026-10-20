/**
 * Marketing landing at /landing — Research Gateway.
 * Shop CTAs leave this ads host and open the main PEPLAB storefront.
 */
import '@/landing/index.css';
import '@/landing/research-atelier.css';
import BrandSplash from '@/landing/components/BrandSplash';
import ResearchGateway from '@/landing/pages/ResearchGateway';
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';
import { MAIN_SITE_URL } from '@/landing/lib/site';

export default function PeplabLandingRoute() {
  return (
    <>
      <BrandSplash />
      <Navigation logoHref="/" linkBase={MAIN_SITE_URL} />
      <CartDrawer />
      <ResearchGateway />
    </>
  );
}
