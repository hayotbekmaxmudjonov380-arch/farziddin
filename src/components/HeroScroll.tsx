import { useRef, useState } from 'react';
import { FlaskConical, Play } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useI18n } from '@/i18n/I18nContext';

const SHOWCASE_IMAGE =
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80';

const PLAYBACK_RATE = 0.5;

export default function HeroScroll() {
  const { t } = useI18n();
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.playbackRate = PLAYBACK_RATE;
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <section id="showcase" className="relative overflow-hidden">
      <div className="absolute inset-0 radial-glow opacity-20" />

      <div className="relative z-10">
        <ContainerScroll
          titleComponent={
            <>
              <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400">
                {t.showcase.tag}
              </span>
              <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-white">
                {t.showcase.title}{' '}
                <span className="text-gradient-accent">{t.showcase.highlight}</span>
              </h2>
              <p className="mt-4 text-white/60 max-w-2xl mx-auto">{t.showcase.subtitle}</p>
            </>
          }
        >
          {videoFailed ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-navy-800">
              <FlaskConical className="h-16 w-16 text-accent-400" />
              <p className="text-white/40 text-sm">{t.showcase.imageAlt}</p>
            </div>
          ) : (
            <div className="relative h-full w-full group">
              <video
                ref={videoRef}
                src="/videos/video.mp4"
                poster={SHOWCASE_IMAGE}
                preload="metadata"
                playsInline
                muted
                controls={playing}
                onLoadedMetadata={(e) => {
                  e.currentTarget.playbackRate = PLAYBACK_RATE;
                }}
                onEnded={() => setPlaying(false)}
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover"
              />

              {!playing && (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={t.showcase.play}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 shadow-xl group-hover:bg-black/60 group-hover:scale-110 transition-all duration-300">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-white ml-1" fill="currentColor" />
                  </span>
                </button>
              )}
            </div>
          )}
        </ContainerScroll>
      </div>
    </section>
  );
}
