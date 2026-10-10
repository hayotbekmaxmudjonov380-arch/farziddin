import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Trophy, GraduationCap } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';

const icons = [Users, TrendingUp, Trophy, GraduationCap];

const CERTIFICATES = [
  {
    image: '/images/certificates/sertifikat.jpg',
    name: 'Maxsudov Mirzabek',
    subject: 'Kimyo',
    score: '61.13',
    percent: '94.05%',
    grade: 'B+',
    test: '56.23',
    written: '66.02',
  },
  {
    image: '/images/certificates/sertifikat1.jpg',
    name: 'Sultonmurotov Alisher',
    subject: 'Kimyo',
    score: '63.93',
    percent: '98.35%',
    grade: 'B+',
    test: '67.16',
    written: '60.69',
  },
  {
    image: '/images/certificates/sertifikat3.jpg',
    name: 'Bahodirov Muhriddin',
    subject: 'Kimyo',
    score: '63.36',
    percent: '97.48%',
    grade: 'B+',
    test: '63.91',
    written: '62.82',
  },
  {
    image: '/images/certificates/sertifikat4.jpg',
    name: 'Sultonboyev Shamsiddin',
    subject: 'Kimyo',
    score: '64.03',
    percent: '98.51%',
    grade: 'B+',
    test: '63.63',
    written: '64.42',
  },
  {
    image: '/images/certificates/sertifikat5.jpg',
    name: "Ro'zmatov Amirxon",
    subject: 'Kimyo',
    score: '53.68',
    percent: '82.58%',
    grade: 'C+',
    test: '50.4',
    written: '56.96',
  },
  {
    image: '/images/certificates/sertifikat6.jpg',
    name: 'Umarova Nurjahon',
    subject: 'Kimyo',
    score: '59.05',
    percent: '90.85%',
    grade: 'B',
    test: '54.21',
    written: '63.88',
  },
  {
    image: '/images/certificates/sertifikat7.jpg',
    name: 'Ilxomboyeva Farangiz',
    subject: 'Kimyo',
    score: '62.56',
    percent: '96.25%',
    grade: 'B+',
    test: '64.42',
    written: '60.69',
  },
  {
    image: '/images/certificates/sertifikat8.jpg',
    name: 'Ozodova Mavluda',
    subject: 'Kimyo',
    score: '47.67',
    percent: '73.34%',
    grade: 'C',
    test: '49.02',
    written: '46.31',
  },
  {
    image: '/images/certificates/sertifikat9.jpg',
    name: 'Yusupova Shahodat',
    subject: 'Kimyo',
    score: '55.05',
    percent: '84.69%',
    grade: 'B',
    test: '54.21',
    written: '55.89',
  },
  {
    image: '/images/certificates/sertifikat10.jpg',
    name: 'Alimov Oybek',
    subject: 'Kimyo',
    score: '49.26',
    percent: '75.78%',
    grade: 'C',
    test: '50.07',
    written: '48.44',
  },
  {
    image: '/images/certificates/sertifikat11.jpg',
    name: "G'oipova Barchinoy",
    subject: 'Kimyo',
    score: '48.55',
    percent: '74.69%',
    grade: 'C',
    test: '54.52',
    written: '42.58',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-heading text-4xl sm:text-5xl font-bold text-gradient-accent">
      {count}{suffix}
    </div>
  );
}

export default function Results() {
  const { t } = useI18n();

  const certificateItems: WorksWheelItem[] = CERTIFICATES.map((cert) => ({
    title: cert.name,
    caption: cert.name,
    image: cert.image,
    details: [
      { label: t.results.cert.subject, value: cert.subject },
      { label: t.results.cert.score, value: cert.score },
      { label: t.results.cert.percent, value: cert.percent },
      { label: t.results.cert.grade, value: cert.grade },
      { label: t.results.cert.test, value: cert.test },
      { label: t.results.cert.written, value: cert.written },
    ],
  }));

  return (
    <section id="results" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400">
            {t.results.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.results.title}
          </h2>
          <p className="mt-3 text-white/60">{t.results.subtitle}</p>
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {t.results.counters.map((counter, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-3xl p-6 text-center hover:border-accent-400/30 transition-all duration-300 group"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-accent-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-accent-400" />
                </div>
                <AnimatedCounter value={counter.value} suffix={counter.suffix} />
                <div className="mt-2 text-sm text-white/50">{counter.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Certificate wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="h-[70vh] min-h-[26rem] max-h-[44rem] w-full">
            <WorksWheel items={certificateItems} label={t.results.gallery} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
