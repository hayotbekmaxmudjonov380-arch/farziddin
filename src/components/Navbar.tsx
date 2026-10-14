import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import type { Lang } from '@/i18n/translations';

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.advantages, href: '#advantages' },
    { label: t.nav.audience, href: '#audience' },
    { label: t.nav.curriculum, href: '#curriculum' },
    { label: t.nav.results, href: '#results' },
    { label: t.nav.faq, href: '#faq' },
  ];

  const langs: Lang[] = ['uz', 'en', 'ru'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong py-2.5 sm:py-3 shadow-lg' : 'bg-transparent py-3 sm:py-5'
      }`}
      style={{
        paddingTop: scrolled
          ? 'max(0.65rem, env(safe-area-inset-top))'
          : 'max(0.75rem, env(safe-area-inset-top))',
      }}
    >
      <div className="mx-auto flex max-w-7xl 2xl:max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center group py-1">
          <img
            src="/images/logotip.png"
            alt="AMINOV CHEMISTRY"
            className="h-9 sm:h-11 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-white/70 hover:text-accent-400 transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-3 right-3 h-px bg-accent-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          ))}
        </div>

        {/* Right Side Controls: Language Switcher, Apply CTA, Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-white/10 bg-navy-900/60 p-0.5 sm:p-1 backdrop-blur-md">
            {langs.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold uppercase rounded-full transition-all duration-200 ${
                  lang === l
                    ? 'bg-accent-400 text-navy-950 shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Desktop/Tablet CTA */}
          <a
            href="#apply"
            className="hidden sm:flex magnetic-btn items-center rounded-full bg-accent-400 px-5 py-2 text-sm font-bold text-navy-950 glow-accent hover:bg-accent-300 transition-colors"
          >
            {t.nav.apply}
          </a>

          {/* Mobile menu toggle (Burger) */}
          <button
            type="button"
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menyu"
          >
            {menuOpen ? <X className="h-6 w-6 text-accent-400" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden glass-strong border-t border-white/10 mt-2 px-4 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-white/80 hover:text-accent-400 hover:bg-white/5 rounded-xl transition-colors font-medium text-sm"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href="#apply"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-accent-400 px-5 py-3 font-bold text-navy-950 glow-accent"
              >
                {t.nav.apply}
              </a>
              <a
                href="tel:+998976021642"
                className="flex items-center justify-center gap-2 rounded-full border border-accent-400/30 px-5 py-2.5 text-accent-400 text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                +998 97 602 16 42
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
