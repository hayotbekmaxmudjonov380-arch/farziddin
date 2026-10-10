import { motion } from 'framer-motion';
import { MapPin, Phone, Send, Instagram, Clock } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 radial-glow opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/images/logotip.png"
                alt="AMINOV CHEMISTRY"
                className="h-14 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                draggable={false}
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {t.about.title} — {t.about.subtitle}
            </p>
            <p className="mt-2 text-white/40 text-xs">{t.about.school}</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">{t.footer.title}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="h-4 w-4 text-accent-400 flex-shrink-0 mt-0.5" />
                {t.footer.address}
              </li>
              <li>
                <a href="tel:+998976021642" className="flex items-center gap-2 text-white/60 hover:text-accent-400 transition-colors">
                  <Phone className="h-4 w-4 text-accent-400 flex-shrink-0" />
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <Clock className="h-4 w-4 text-accent-400 flex-shrink-0" />
                {t.footer.schedule}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Social</h3>
            <div className="flex gap-3">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center text-neon-400 hover:border-neon-400/30 hover:bg-neon-400/10 transition-all"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gold-400 hover:border-gold-400/30 hover:bg-gold-400/10 transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="tel:+998976021642"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center text-accent-400 hover:border-accent-400/30 hover:bg-accent-400/10 transition-all"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-3 text-xs text-white/40">{t.footer.telegram}</p>
            <p className="mt-1 text-xs text-white/40">{t.footer.instagram}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: t.nav.about, href: '#about' },
                { label: t.nav.curriculum, href: '#curriculum' },
                { label: t.nav.apply, href: '#apply' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/50 hover:text-accent-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-white/40 text-xs">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
