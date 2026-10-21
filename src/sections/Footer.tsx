import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Beaker,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Shield,
  Truck,
} from 'lucide-react';
import { CONFIG } from '@/lib/config';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/auspost';
import { getSiteSetting, DEFAULT_SUPPORT_LINKS } from '@/lib/settings';
import { HOME_PATH, SHOP_PATH, CALCULATOR_PATH, COA_ARCHIVE_PATH } from '@/lib/routes';
import { shopUrl } from '@/landing/lib/site';
// PROTOCOLS_PATH temporarily unused — restore with Dosage chart footer link
// import { HOME_PATH, SHOP_PATH, PROTOCOLS_PATH, CALCULATOR_PATH, COA_ARCHIVE_PATH } from '@/lib/routes';

const HIGHLIGHTS = [
  {
    icon: Beaker,
    iconClass: 'nl-footer-highlight-icon--teal',
    title: 'HPLC-verified',
    description: '≥99% purity on every batch.',
  },
  {
    icon: Shield,
    iconClass: 'nl-footer-highlight-icon--purple',
    title: 'Lab tested',
    description: 'Independent 3rd-party analysis.',
  },
  {
    icon: Truck,
    iconClass: 'nl-footer-highlight-icon--blue',
    title: 'Fast shipping',
    description: `Free express over $${FREE_SHIPPING_THRESHOLD} Australia-wide.`,
  },
  {
    icon: CreditCard,
    iconClass: 'nl-footer-highlight-icon--pink',
    title: 'Secure payment',
    description: 'Encrypted checkout — cards, wallets & crypto.',
  },
] as const;

export default function Footer() {
  const [telegramLink, setTelegramLink] = useState(DEFAULT_SUPPORT_LINKS.telegram_link);
  const [whatsappLink, setWhatsappLink] = useState(DEFAULT_SUPPORT_LINKS.whatsapp_link);

  useEffect(() => {
    (async () => {
      try {
        const telegramVal = await getSiteSetting('telegram_link', {
          url: DEFAULT_SUPPORT_LINKS.telegram_link,
        });
        setTelegramLink((telegramVal as { url?: string })?.url || DEFAULT_SUPPORT_LINKS.telegram_link);

        const whatsappVal = await getSiteSetting('whatsapp_link', {
          url: DEFAULT_SUPPORT_LINKS.whatsapp_link,
        });
        setWhatsappLink((whatsappVal as { url?: string })?.url || '');
      } catch {
        /* keep defaults */
      }
    })();
  }, []);

  return (
    <footer id="footer" className="nl-footer relative z-10">
      <div className="nl-footer-glow pointer-events-none" aria-hidden />

      <div className="nl-footer-container">
        <div className="nl-footer-highlights">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="nl-footer-highlight">
                <div className={`nl-footer-highlight-icon ${item.iconClass}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="nl-footer-highlight-title">{item.title}</p>
                  <p className="nl-footer-highlight-desc">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="nl-footer-highlights-tag">
          Australian compliant • Lab-grade peptides • Research use only
        </p>

        <div className="nl-footer-disclaimer-box">
          <p className="nl-footer-disclaimer-heading">Research use only</p>
          <p className="nl-footer-disclaimer-text">
            All products sold by PEPLAB are intended strictly for laboratory and research use only. They
            are not medicines, supplements, or therapeutic goods and are not intended for human or animal
            consumption.
          </p>
        </div>

        <div className="nl-footer-grid">
          <div className="nl-footer-brand">
            <Link to={HOME_PATH} className="nl-footer-logo-block">
              <span className="text-2xl font-bold tracking-[0.12em] gradient-text">PEPLAB</span>
              <span className="nl-footer-logo-sub">Peptides Australia</span>
            </Link>
            <p className="nl-footer-tagline">{CONFIG.SITE_DESCRIPTION}</p>
          </div>

          <div className="nl-footer-col">
            <h4 className="nl-footer-col-heading">Shop</h4>
            <ul className="nl-footer-links">
              <li>
                <a href={shopUrl(SHOP_PATH)}>All products</a>
              </li>
              <li>
                <a href={shopUrl(SHOP_PATH)}>Best sellers</a>
              </li>
              <li>
                <a href={shopUrl(SHOP_PATH)}>New arrivals</a>
              </li>
            </ul>
          </div>

          <div className="nl-footer-col">
            <h4 className="nl-footer-col-heading">Quality</h4>
            <ul className="nl-footer-links">
              <li>
                <a href={shopUrl('/research')}>Research</a>
              </li>
              <li>
                <a href={shopUrl('/blog')}>Blog</a>
              </li>
              <li>
                <a href={shopUrl(COA_ARCHIVE_PATH)}>COA results</a>
              </li>
              <li>
                <a href={shopUrl('/standards')}>Our standards</a>
              </li>
              {/* Temporarily disabled — client asked to remove protocols (compliance risk).
              <li>
                <a href={shopUrl('/protocols')}>Dosage chart</a>
              </li>
              */}
              <li>
                <a href={shopUrl(CALCULATOR_PATH)}>Calculator</a>
              </li>
              <li>
                <a href={shopUrl('/faq')}>FAQ</a>
              </li>
            </ul>
          </div>

          <div className="nl-footer-col">
            <h4 className="nl-footer-col-heading">Support</h4>
            <ul className="nl-footer-links">
              <li>
                <a href={shopUrl('/track-order')}>Track order</a>
              </li>
              <li>
                <a href={shopUrl('/contact-info')}>Contact us</a>
              </li>
              {CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL ? (
                <li>
                  <a href={`mailto:${CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL}`}>
                    {CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                  Telegram support
                </a>
              </li>
              {whatsappLink ? (
                <li>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    WhatsApp support
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="nl-footer-col">
            <h4 className="nl-footer-col-heading">Business details</h4>
            <ul className="nl-footer-contact-detail">
              {(CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL) && (
                <li>
                  <Mail className="w-4 h-4 shrink-0 text-[#2ED1B4]" aria-hidden />
                  <div>
                    <span className="nl-footer-contact-label">Email</span>
                    <a
                      href={`mailto:${CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL}`}
                      className="nl-footer-contact-text hover:text-[#2ED1B4] transition-colors"
                    >
                      {CONFIG.SUPPORT_EMAIL || CONFIG.CONTACT_EMAIL}
                    </a>
                  </div>
                </li>
              )}
              <li>
                <MapPin className="w-4 h-4 shrink-0 text-[#2ED1B4]" aria-hidden />
                <div>
                  <span className="nl-footer-contact-label">Registered address</span>
                  <address>
                    {CONFIG.BUSINESS.ADDRESS_LINES.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>
              <li>
                <Clock className="w-4 h-4 shrink-0 text-[#2ED1B4]" aria-hidden />
                <div>
                  <span className="nl-footer-contact-label">Business hours</span>
                  <span className="nl-footer-contact-text">{CONFIG.BUSINESS.BUSINESS_HOURS}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="nl-footer-col">
            <h4 className="nl-footer-col-heading">Legal policies</h4>
            <ul className="nl-footer-links">
              <li>
                <a href={shopUrl('/shipping')}>Shipping Policy</a>
              </li>
              <li>
                <a href={shopUrl('/refund')}>Return & Refund Policy</a>
              </li>
              <li>
                <a href={shopUrl('/privacy')}>Privacy Policy</a>
              </li>
              <li>
                <a href={shopUrl('/terms')}>Terms of Service</a>
              </li>
              <li>
                <a href={shopUrl('/legal')}>Legal & compliance</a>
              </li>
              <li>
                <a href={shopUrl('/rewards-terms')}>Rewards terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="nl-footer-bottom">
          <div className="nl-footer-bottom-inner">
            <div className="nl-footer-bottom-brand">
              <span className="text-xl font-bold tracking-[0.12em] gradient-text">PEPLAB</span>
              <span className="nl-footer-logo-sub">Peptides Australia</span>
            </div>
            <p className="nl-footer-bottom-notice">
              For research use only. Not for human consumption. All products are intended for laboratory
              research purposes only.
            </p>
            <p className="nl-footer-bottom-copy">
              © {new Date().getFullYear()} PEPLAB. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
