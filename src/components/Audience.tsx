import { motion } from 'framer-motion';
import { Landmark, FileBadge, Trophy, School, BookMarked } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const icons = [Landmark, FileBadge, Trophy, School, BookMarked];
const colors = [
  { bg: 'from-accent-400/20 to-accent-500/10', text: 'text-accent-400', border: 'hover:border-accent-400/30' },
  { bg: 'from-neon-400/20 to-neon-500/10', text: 'text-neon-400', border: 'hover:border-neon-400/30' },
  { bg: 'from-gold-400/20 to-gold-500/10', text: 'text-gold-400', border: 'hover:border-gold-400/30' },
  { bg: 'from-accent-400/20 to-neon-400/10', text: 'text-accent-400', border: 'hover:border-accent-400/30' },
  { bg: 'from-neon-400/20 to-accent-400/10', text: 'text-neon-400', border: 'hover:border-neon-400/30' },
];

export default function Audience() {
  const { t } = useI18n();

  return (
    <section id="audience" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-neon-400/30 bg-neon-400/10 px-4 py-1.5 text-sm font-medium text-neon-400">
            {t.audience.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.audience.title}
          </h2>
          <p className="mt-3 text-white/60">{t.audience.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.audience.items.map((item, i) => {
            const Icon = icons[i];
            const color = colors[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group glass rounded-3xl p-6 border border-white/10 ${color.border} transition-all duration-400 ${
                  i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${color.text}`} />
                </div>
                <h3 className="font-semibold text-white text-base mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
