import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';

export default function Preloader() {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-navy-950 transition-opacity duration-500"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Nucleus */}
        <div className="absolute h-4 w-4 rounded-full bg-accent-400 glow-accent" />

        {/* Orbit 1 */}
        <div className="absolute h-24 w-24 animate-spin-slow rounded-full border border-accent-400/30">
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-400" />
        </div>

        {/* Orbit 2 */}
        <div className="absolute h-20 w-20 animate-spin-slower rounded-full border border-neon-400/30" style={{ transform: 'rotate(60deg)' }}>
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-neon-400" />
        </div>

        {/* Orbit 3 */}
        <div className="absolute h-28 w-28 animate-spin-slow rounded-full border border-gold-400/20" style={{ transform: 'rotate(-30deg)' }}>
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold-400" />
        </div>
      </div>

      <div className="mt-8 h-px w-48 bg-navy-700 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-400 to-neon-400 transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-4 font-display text-sm text-accent-400/70 tracking-widest uppercase">
        {t.preloader.text}
      </p>
    </div>
  );
}
