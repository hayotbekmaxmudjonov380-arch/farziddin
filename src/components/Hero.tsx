import { motion } from 'framer-motion';
import { Phone, Send, ArrowRight, Atom } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import ScientificAtom3D from './ScientificAtom3D';

const floatFormulas = [
  { text: 'H₂O', top: '15%', left: '8%', delay: 0 },
  { text: 'CO₂', top: '70%', left: '12%', delay: 1.5 },
  { text: 'NaCl', top: '25%', left: '85%', delay: 0.8 },
  { text: 'O₂', top: '60%', left: '88%', delay: 2 },
  { text: 'C₆H₁₂O₆', top: '45%', left: '5%', delay: 1 },
  { text: 'Fe₂O₃', top: '82%', left: '75%', delay: 2.5 },
];

export default function Hero() {
  const { t } = useI18n();

  const stats = [
    { value: '10+', label: t.hero.stats.years },
    { value: '500+', label: t.hero.stats.students },
    { value: '95%', label: t.hero.stats.success },
    { value: '5', label: t.hero.stats.categories },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] min-h-[100dvh] min-h-[100svh] flex flex-col justify-center overflow-hidden pt-16 sm:pt-20 lg:pt-20 pb-12 sm:pb-14 lg:pb-12"
      style={{
        paddingBottom: 'max(3.5rem, calc(2.5rem + env(safe-area-inset-bottom)))',
      }}
    >
      {/* Background visual layers */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* Floating chemical formulas for visual depth */}
      {floatFormulas.map((f, i) => (
        <div
          key={i}
          className="absolute font-display text-lg sm:text-2xl text-accent-400/20 pointer-events-none animate-float-slow hidden md:block"
          style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
          aria-hidden="true"
        >
          {f.text}
        </div>
      ))}

      {/* Main Container: 4K / Ultrawide constrained to max-w-[1440px] */}
      <div className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-center">
          {/* TEXT CONTENT: Mobile-first comes FIRST in normal DOM order */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full lg:py-2">
            {/* Scientific Course Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-3.5 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 shadow-sm backdrop-blur-md"
            >
              <Atom className="h-4 w-4 text-accent-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-accent-400">
                {t.hero.badge}
              </span>
            </motion.div>

            {/* Fluid Responsive Heading with clamp() and text-balance */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-[clamp(2.15rem,6.8vw,4.25rem)] font-bold leading-[1.08] tracking-tight [text-wrap:balance] max-w-2xl"
            >
              <span className="text-white">
                {t.hero.title1.split(' ').slice(0, -2).join(' ')}
              </span>{' '}
              <span className="text-gradient-accent">
                {t.hero.title1.split(' ').slice(-2).join(' ')}
              </span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/75 max-w-xl leading-relaxed [text-wrap:pretty]"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Action CTA Buttons (with id="hero-cta" for floating bar visibility observer) */}
            <motion.div
              id="hero-cta"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 sm:mt-7 w-full max-w-md lg:max-w-none flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-stretch sm:items-center"
            >
              {/* Primary Call to Action */}
              <a
                href="#apply"
                className="magnetic-btn group flex items-center justify-center gap-2 rounded-full bg-accent-400 px-6 sm:px-7 py-3.5 font-bold text-navy-950 glow-accent hover:bg-accent-300 transition-all text-sm sm:text-base shrink-0 active:scale-95"
              >
                {t.hero.ctaApply}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Secondary Actions: 2-column grid on mobile, inline on tablet/desktop */}
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center">
                <a
                  href="tel:+998976021642"
                  className="magnetic-btn flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 sm:px-6 py-3 font-semibold text-white hover:border-accent-400/50 hover:bg-accent-400/10 transition-all text-xs sm:text-sm active:scale-95"
                >
                  <Phone className="h-4 w-4 text-accent-400 shrink-0" />
                  <span>{t.hero.ctaCall}</span>
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-btn flex items-center justify-center gap-2 rounded-full border border-neon-400/30 bg-neon-400/5 px-4 sm:px-6 py-3 font-semibold text-neon-400 hover:bg-neon-400/10 transition-all text-xs sm:text-sm active:scale-95"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>{t.hero.ctaTelegram}</span>
                </a>
              </div>
            </motion.div>

            {/* Desktop Statistics: placed right below CTA in left column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-9 hidden lg:grid grid-cols-4 gap-4 max-w-lg w-full"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="font-heading text-2xl xl:text-3xl font-bold text-gradient-accent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-white/50 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D SCIENTIFIC SIMULATION: Appears after text in mobile-first flow, in right column on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex items-center justify-center"
          >
            <ScientificAtom3D />
          </motion.div>

          {/* Mobile & Tablet Statistics: Placed at the bottom after the 3D scene in normal mobile flow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid lg:hidden grid-cols-2 xs:grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto w-full pt-2"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-3 rounded-xl bg-navy-900/40 border border-white/5 backdrop-blur-sm"
              >
                <div className="font-heading text-xl sm:text-2xl font-bold text-gradient-accent">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-white/50 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle scroll indicator for desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="hidden lg:flex absolute bottom-3 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-7 w-px bg-gradient-to-b from-accent-400/50 to-transparent" />
      </motion.div>
    </section>
  );
}
