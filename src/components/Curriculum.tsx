import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, ClipboardCheck, Trophy, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const stageStyles: Record<string, { badge: string; node: string; icon: LucideIcon }> = {
  theory: {
    badge: 'border-accent-400/30 bg-accent-400/10 text-accent-400',
    node: 'border-accent-400/40 bg-accent-400/10 text-accent-400 group-hover:border-accent-400/70',
    icon: BookOpen,
  },
  practice: {
    badge: 'border-neon-400/30 bg-neon-400/10 text-neon-400',
    node: 'border-neon-400/40 bg-neon-400/10 text-neon-400 group-hover:border-neon-400/70',
    icon: FlaskConical,
  },
  test: {
    badge: 'border-gold-400/30 bg-gold-400/10 text-gold-400',
    node: 'border-gold-400/40 bg-gold-400/10 text-gold-400 group-hover:border-gold-400/70',
    icon: ClipboardCheck,
  },
  olympiada: {
    badge: 'border-gold-300/30 bg-gold-300/10 text-gold-300',
    node: 'border-gold-300/40 bg-gold-300/10 text-gold-300 group-hover:border-gold-300/70',
    icon: Trophy,
  },
};

export default function Curriculum() {
  const { t } = useI18n();
  const modules = t.curriculum.modules;

  const flow = modules.filter(
    (m, i, arr) => arr.findIndex((x) => x.type === m.type) === i
  );

  return (
    <section id="curriculum" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-400">
            {t.curriculum.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.curriculum.title}
          </h2>
          <p className="mt-3 text-white/60">{t.curriculum.subtitle}</p>

          {/* Stage flow: Nazariya → Amaliyot → Test → Olimpiada */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            {flow.map((m, i) => {
              const style = stageStyles[m.type] ?? stageStyles.theory;
              const Icon = style.icon;
              return (
                <div key={m.type} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/20">→</span>}
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${style.badge}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {m.stage}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Roadmap timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical rail */}
          <div className="absolute left-7 sm:left-8 top-4 bottom-4 w-px bg-gradient-to-b from-accent-400/50 via-neon-400/30 to-gold-400/20" />

          <div>
            {modules.map((module, i) => {
              const style = stageStyles[module.type] ?? stageStyles.theory;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group relative flex gap-4 sm:gap-6 pb-10 last:pb-0"
                >
                  {/* Node with code */}
                  <div
                    className={`relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border font-heading text-xs sm:text-sm font-bold backdrop-blur-sm transition-colors duration-300 ${style.node}`}
                  >
                    {module.code}
                  </div>

                  {/* Card */}
                  <div className="flex-1 glass rounded-2xl p-5 sm:p-6 relative hover:border-accent-400/30 transition-all duration-300">
                    <span className="absolute top-4 right-5 font-heading text-3xl sm:text-4xl font-bold text-white/10 group-hover:text-accent-400/25 transition-colors duration-300">
                      {module.num}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${style.badge}`}
                    >
                      {(() => {
                        const Icon = style.icon;
                        return <Icon className="h-3 w-3" />;
                      })()}
                      {module.stage}
                    </span>

                    <h3 className="mt-3 pr-12 font-semibold text-white text-base sm:text-lg">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-white/60 text-sm leading-relaxed">{module.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
