import { motion } from 'framer-motion';
import { Target, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const icons = [Target, BookOpen, UserCheck, TrendingUp];

export default function Advantages() {
  const { t } = useI18n();

  return (
    <section id="advantages" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400">
            {t.advantages.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.advantages.title}
          </h2>
          <p className="mt-3 text-white/60">{t.advantages.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {t.advantages.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative glass rounded-3xl p-8 hover:border-accent-400/30 transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute -inset-px bg-gradient-to-br from-accent-400/0 via-accent-400/0 to-accent-400/0 group-hover:from-accent-400/5 group-hover:to-neon-400/5 transition-all duration-500 rounded-3xl" />

                <div className="relative flex items-start gap-5">
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400/20 to-neon-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-accent-400" />
                    </div>
                    <div className="absolute inset-0 bg-accent-400/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading text-2xl font-bold text-white/10 group-hover:text-accent-400/20 transition-colors">
                        0{i + 1}
                      </span>
                      <h3 className="font-semibold text-white text-lg leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
