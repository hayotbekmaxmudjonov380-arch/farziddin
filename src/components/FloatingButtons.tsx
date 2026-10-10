import { useEffect, useState, type CSSProperties } from 'react';
import { Phone, Send, ArrowUp } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface FloatItemProps {
  color: string;
  label: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function FloatItem({ color, label, href, onClick, children }: FloatItemProps) {
  const className = `float-btn${href ? ' float-btn-link' : ''}`;

  const inner = (
    <>
      <span className="float-ghost float-ghost-3" aria-hidden="true" />
      <span className="float-ghost float-ghost-2" aria-hidden="true" />
      <span className="float-ghost float-ghost-1" aria-hidden="true" />
      {href ? (
        <a
          href={href}
          className={className}
          aria-label={label}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={className} aria-label={label}>
          {children}
        </button>
      )}
      <span className="float-label">{label}</span>
    </>
  );

  return (
    <div className="float-item" style={{ '--fc': color } as CSSProperties}>
      {inner}
    </div>
  );
}

export default function FloatingButtons() {
  const { t } = useI18n();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-3 items-end">
      <div className="float-card">
        {/* Scroll to top */}
        {showScrollTop && (
          <FloatItem
            color="#ffffff"
            label={t.floating.top}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="h-6 w-6" />
          </FloatItem>
        )}

        {/* Telegram */}
        <FloatItem color="#38bdf8" label={t.floating.telegram} href="https://t.me/">
          <Send className="h-6 w-6" />
        </FloatItem>

        {/* Call */}
        <FloatItem color="#2dffb0" label={t.floating.call} href="tel:+998976021642">
          <Phone className="h-6 w-6" />
        </FloatItem>
      </div>

      {/* Apply CTA - mobile only */}
      <a
        href="#apply"
        className="sm:hidden magnetic-btn flex items-center gap-1.5 rounded-full bg-accent-400 px-5 py-3 font-bold text-navy-950 glow-accent text-sm"
      >
        {t.floating.apply}
      </a>
    </div>
  );
}
