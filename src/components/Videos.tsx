import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

const LESSON_VIDEO = '/videos/dars_jarayoni.mp4';
const LESSON_VIDEO_2 = '/videos/dars_jarayoni2.mp4';
const LESSON_VIDEO_3 = '/videos/dars_jarayoni3.mp4';

function LessonVideoCard({
  src,
  playLabel,
  fallbackLabel,
}: {
  src: string;
  playLabel: string;
  fallbackLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  if (failed) {
    return (
      <div className="relative aspect-video rounded-2xl glass overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-400/10 flex items-center justify-center">
            <Video className="h-7 w-7 text-white/30" />
          </div>
          <p className="text-white/40 text-sm text-center px-6">{fallbackLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative aspect-video rounded-2xl glass overflow-hidden hover:border-accent-400/30 transition-all duration-300">
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />

      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={playLabel}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 shadow-xl group-hover:bg-black/60 group-hover:scale-110 transition-all duration-300">
            <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}

export default function Videos() {
  const { t } = useI18n();

  return (
    <section id="videos" className="relative py-24 lg:py-32 overflow-hidden">
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
            {t.videos.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.videos.title}
          </h2>
          <p className="mt-3 text-white/60">{t.videos.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <LessonVideoCard src={LESSON_VIDEO} playLabel={t.videos.play} fallbackLabel={t.videos.placeholder} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LessonVideoCard src={LESSON_VIDEO_2} playLabel={t.videos.play} fallbackLabel={t.videos.placeholder} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LessonVideoCard src={LESSON_VIDEO_3} playLabel={t.videos.play} fallbackLabel={t.videos.placeholder} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
