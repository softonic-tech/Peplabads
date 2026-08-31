/**
 * Marketing landing at /landing.
 */
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';
import MarketingLanding from '@/pages/MarketingLanding';

export default function PeplabLandingRoute() {
  return (
    <>
      <Navigation />
      <CartDrawer />
      <div className="pt-16 sm:pt-20 lg:pt-24">
        <MarketingLanding />
      </div>
    </>
  );
}
