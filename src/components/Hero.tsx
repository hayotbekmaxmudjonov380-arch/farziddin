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

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 radial-glow" />

      {/* Floating formulas */}
      {floatFormulas.map((f, i) => (
        <div
          key={i}
          className="absolute font-display text-lg sm:text-2xl text-accent-400/20 pointer-events-none animate-float-slow hidden sm:block"
          style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
        >
          {f.text}
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content — z-10 so the free 3D scene never paints over the text */}
          <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-2 mb-6"
            >
              <Atom className="h-4 w-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-400">{t.hero.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="text-white">{t.hero.title1.split(' ').slice(0, -2).join(' ')}</span>{' '}
              <span className="text-gradient-accent">{t.hero.title1.split(' ').slice(-2).join(' ')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <a
                href="#apply"
                className="magnetic-btn group flex items-center gap-2 rounded-full bg-accent-400 px-7 py-3.5 font-bold text-navy-950 glow-accent hover:bg-accent-300 transition-colors"
              >
                {t.hero.ctaApply}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="tel:+998976021642"
                className="magnetic-btn flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-bold text-white hover:border-accent-400/50 hover:bg-accent-400/10 transition-all"
              >
                <Phone className="h-5 w-5 text-accent-400" />
                {t.hero.ctaCall}
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn flex items-center gap-2 rounded-full border border-neon-400/30 bg-neon-400/5 px-7 py-3.5 font-bold text-neon-400 hover:bg-neon-400/10 transition-all"
              >
                <Send className="h-5 w-5" />
                {t.hero.ctaTelegram}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 grid grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { value: '10+', label: t.hero.stats.years },
                { value: '500+', label: t.hero.stats.students },
                { value: '95%', label: t.hero.stats.success },
                { value: '5', label: t.hero.stats.categories },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-gradient-accent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-white/50 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Scientific 3D Atom & Molecule Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex items-center justify-center py-4 lg:py-0 w-full"
          >
            <ScientificAtom3D />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="h-12 w-px bg-gradient-to-b from-accent-400/50 to-transparent" />
      </motion.div>
    </section>
  );
}
