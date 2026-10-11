import { Suspense, lazy, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CartProvider } from '@/context/CartContext';
import { RewardsProvider } from '@/context/RewardsContext';
import { AffiliateProvider } from '@/context/AffiliateContext';
import { getSiteSetting, DEFAULT_AFFILIATE_PROGRAM_SETTINGS } from '@/lib/settings';

const PeplabLandingRoute = lazy(() => import('@/pages/PeplabLandingRoute'));

// Ads host (peplabads.com): only /landing is live. Shop + other pages stay on peplab.com.au.
// Restore any of these lazy pages + matching <Route> entries below if this host should
// serve the full storefront again.
//
// import { SHOP_PATH, CALCULATOR_PATH, COA_ARCHIVE_PATH } from '@/lib/routes';
// import { getSiteSetting, DEFAULT_AFFILIATE_PROGRAM_SETTINGS, DEFAULT_LANDING_PAGE_SETTINGS } from '@/lib/settings';
// import { supabase } from '@/lib/supabase';
// import Navigation from '@/components/Navigation';
// import CartDrawer from '@/components/CartDrawer';
// import SignupWelcomeModal from '@/components/SignupWelcomeModal';
// import { CONFIG } from '@/lib/config';
// import { SEO } from '@/components/SEO';
// import { SITE_SEO_DESCRIPTION, SITE_SEO_KEYWORDS, SITE_SEO_TITLE } from '@/lib/seo-keywords';
// import { isLoginOnlyDomain } from '@/lib/domain';
// import { handoffToMainApp } from '@/lib/login-redirect';
// import Catalog from '@/sections/Catalog';
// import BulkSales from '@/sections/BulkSales';
// import Quality from '@/sections/Quality';
// import TrustpilotReviews from '@/sections/TrustpilotReviews';
// import LeaderboardTop3 from '@/sections/LeaderboardTop3';
// import Footer from '@/sections/Footer';
// const Contact = lazy(() => import('@/pages/Contact'));
// const Checkout = lazy(() => import('@/pages/Checkout'));
// const Privacy = lazy(() => import('@/pages/Privacy'));
// const Terms = lazy(() => import('@/pages/Terms'));
// const Refund = lazy(() => import('@/pages/Refund'));
// const Legal = lazy(() => import('@/pages/Legal'));
// const Shipping = lazy(() => import('@/pages/Shipping'));
// const ContactInfo = lazy(() => import('@/pages/ContactInfo'));
// const Standards = lazy(() => import('@/pages/Standards'));
// const Login = lazy(() => import('@/pages/Login'));
// const LoginGateway = lazy(() => import('@/pages/LoginGateway'));
// const Dashboard = lazy(() => import('@/pages/Dashboard'));
// const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
// const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
// const RewardsTerms = lazy(() => import('@/pages/RewardsTerms'));
// const Settings = lazy(() => import('@/pages/Settings'));
// const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
// const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
// const FAQ = lazy(() => import('@/pages/FAQ'));
// const NotFound = lazy(() => import('@/pages/NotFound'));
// const ProductPage = lazy(() => import('@/pages/Product'));
// const PromoterDashboard = lazy(() => import('@/pages/PromoterDashboard'));
// const TrackOrder = lazy(() => import('@/pages/TrackOrder'));
// const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
// const Calculator = lazy(() => import('@/pages/Calculator'));
// const CoaArchive = lazy(() => import('@/pages/CoaArchive'));

gsap.registerPlugin(ScrollTrigger);

/** Inline shell styles — work before Tailwind CSS finishes loading on slow mobile networks. */
const PAGE_SHELL_STYLE = { background: '#070A12', minHeight: '100dvh' } as const;

/** Persist referral ref and affiliate code from URL to sessionStorage. */
function PersistReferralRef() {
  const location = useLocation();
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const params = new URLSearchParams(location.search || '');
      const ref = params.get('ref');
      if (ref && /^[0-9a-f-]{36}$/i.test(ref)) {
        try {
          sessionStorage.setItem('peplab_ref', ref);
        } catch (_) {}
      }
      const affCode = params.get('aff') || params.get('code');
      if (!affCode || !/^[A-Za-z0-9_-]{2,30}$/.test(affCode)) return;
      const program = await getSiteSetting('affiliate_program_settings', DEFAULT_AFFILIATE_PROGRAM_SETTINGS);
      if (cancelled || program.codes_enabled === false) return;
      try {
        sessionStorage.setItem(
          'peplab_affiliate_code',
          JSON.stringify({ code: affCode.toUpperCase(), promotion: null, autoApply: true }),
        );
      } catch (_) {}
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [location.search]);
  return null;
}

function StaleTabReloader() {
  useEffect(() => {
    const STALE_RELOAD_MS = 90 * 1000;
    const HEARTBEAT_MS = 15 * 1000;
    let lastSeenAt = Date.now();
    let reloading = false;

    const isUserActivelyEditing = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const maybeReload = (gap: number) => {
      if (reloading) return;
      if (gap < STALE_RELOAD_MS) return;
      if (isUserActivelyEditing()) return;
      reloading = true;
      window.location.reload();
    };

    const checkGap = () => {
      const now = Date.now();
      const gap = now - lastSeenAt;
      lastSeenAt = now;
      maybeReload(gap);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkGap();
      else lastSeenAt = Date.now();
    };

    const onFocus = () => checkGap();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) checkGap();
    };

    const interval = window.setInterval(() => {
      const now = Date.now();
      const gap = now - lastSeenAt;
      lastSeenAt = now;
      if (gap > HEARTBEAT_MS * 2) maybeReload(gap);
    }, HEARTBEAT_MS);

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    const el = document.getElementById('app-loading');
    if (!el) return;
    el.style.transition = 'opacity 0.15s ease';
    el.style.opacity = '0';
    const t = setTimeout(() => el.remove(), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <CartProvider>
      <RewardsProvider>
        <AffiliateProvider>
          <BrowserRouter>
            <ScrollToTop />
            <PersistReferralRef />
            <StaleTabReloader />
            <Suspense fallback={<div style={PAGE_SHELL_STYLE} />}>
              <Routes>
                <Route path="/landing" element={<PeplabLandingRoute />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AffiliateProvider>
      </RewardsProvider>
    </CartProvider>
  );
}

export default App;
