import { useEffect, useState, type CSSProperties } from 'react';
import { Phone, Send, ArrowUp } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface FloatItemProps {
  color: string;
  label: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function FloatItem({ color, label, href, onClick, children }: FloatItemProps) {
  const className = `float-btn${href ? ' float-btn-link' : ''}`;

  const inner = (
    <>
      <span className="float-ghost float-ghost-3" aria-hidden="true" />
      <span className="float-ghost float-ghost-2" aria-hidden="true" />
      <span className="float-ghost float-ghost-1" aria-hidden="true" />
      {href ? (
        <a
          href={href}
          className={className}
          aria-label={label}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={className} aria-label={label}>
          {children}
        </button>
      )}
      <span className="float-label">{label}</span>
    </>
  );

  return (
    <div className="float-item" style={{ '--fc': color } as CSSProperties}>
      {inner}
    </div>
  );
}

export default function FloatingButtons() {
  const { t } = useI18n();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor Hero CTA visibility: hide mobile bottom floating panel when Hero CTA is on screen
  useEffect(() => {
    const heroCtaEl = document.getElementById('hero-cta');
    if (!heroCtaEl) {
      setHeroCtaVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroCtaVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(heroCtaEl);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 1. DESKTOP FLOATING CONTROLS (Right-bottom vertical card) */}
      <div
        className="fixed z-40 hidden sm:flex flex-col gap-3 items-end right-4 sm:right-6 pointer-events-auto"
        style={{ bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))' }}
      >
        <div className="float-card">
          {/* Scroll to top */}
          {showScrollTop && (
            <FloatItem
              color="#ffffff"
              label={t.floating.top}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className="h-6 w-6" />
            </FloatItem>
          )}

          {/* Telegram */}
          <FloatItem color="#38bdf8" label={t.floating.telegram} href="https://t.me/">
            <Send className="h-6 w-6" />
          </FloatItem>

          {/* Call */}
          <FloatItem color="#2dffb0" label={t.floating.call} href="tel:+998976021642">
            <Phone className="h-6 w-6" />
          </FloatItem>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM STICKY BAR (~56px height)
          Consolidates Apply CTA, Call, and Telegram into a single streamlined dock.
          Automatically hides when the hero CTA buttons are visible to avoid duplicate UI clutter. */}
      <div
        className={`fixed left-3 right-3 z-40 sm:hidden transition-all duration-300 ease-out ${
          heroCtaVisible
            ? 'translate-y-28 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
        style={{
          bottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="h-14 rounded-2xl glass-strong border border-accent-400/25 shadow-2xl p-1.5 flex items-center gap-2 backdrop-blur-2xl bg-navy-950/85">
          {/* Primary CTA: Apply */}
          <a
            href="#apply"
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-accent-400 text-navy-950 font-bold text-sm glow-accent active:scale-95 transition-transform"
          >
            <span>{t.floating.apply}</span>
          </a>

          {/* Secondary Quick Action: Telegram */}
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.floating.telegram}
            className="h-11 w-11 flex items-center justify-center rounded-xl bg-neon-400/10 border border-neon-400/30 text-neon-400 active:scale-95 transition-transform shrink-0"
          >
            <Send className="h-5 w-5" />
          </a>

          {/* Secondary Quick Action: Phone Call */}
          <a
            href="tel:+998976021642"
            aria-label={t.floating.call}
            className="h-11 w-11 flex items-center justify-center rounded-xl bg-accent-400/10 border border-accent-400/30 text-accent-400 active:scale-95 transition-transform shrink-0"
          >
            <Phone className="h-5 w-5" />
          </a>

          {/* Scroll to Top (optional icon when user has scrolled down deep) */}
          {showScrollTop && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label={t.floating.top}
              className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white active:scale-95 transition-transform shrink-0"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
