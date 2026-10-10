import { motion } from 'framer-motion';
import { Award, GraduationCap, BadgeCheck, Briefcase, MapPin } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const icons = [Award, GraduationCap, BadgeCheck, Briefcase];

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400">
            {t.about.tag}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Teacher portrait placeholder with decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            {/* Decorative orbits */}
            <div className="absolute h-80 w-80 sm:h-96 sm:w-96 animate-spin-slower rounded-full border border-accent-400/10" />
            <div className="absolute h-64 w-64 sm:h-72 sm:w-72 animate-spin-slow rounded-full border border-neon-400/10" style={{ transform: 'rotate(45deg)' }} />

            {/* Portrait circle */}
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full overflow-hidden glass-strong glow-accent">
              <img
                src="/images/foto.jpg"
                alt={t.about.title}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute top-4 right-4 sm:right-8 glass rounded-2xl px-4 py-2 animate-float">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-400" />
                <span className="text-sm font-medium text-white">10+</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 sm:left-8 glass rounded-2xl px-4 py-2 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-accent-400" />
                <span className="text-sm font-medium text-white">95%</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio + achievements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {t.about.title}
            </h2>
            <p className="mt-2 text-lg text-accent-400 font-medium">{t.about.subtitle}</p>
            <p className="mt-1 text-sm text-white/50 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {t.about.school}
            </p>

            <p className="mt-6 text-white/70 leading-relaxed text-base sm:text-lg">
              {t.about.bio}
            </p>

            {/* Achievement cards */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {t.about.achievements.items.map((item, i) => {
                const Icon = icons[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass rounded-2xl p-5 hover:border-accent-400/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-400/10 flex items-center justify-center group-hover:bg-accent-400/20 transition-colors">
                        <Icon className="h-5 w-5 text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm leading-tight">{item.title}</h3>
                        <p className="mt-1 text-xs text-white/50">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
