import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Touch devices keep the native cursor; no listeners, no rAF loop.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"], .magnetic-btn');
      setIsHovering(Boolean(isInteractive));
    };

    const handleLeave = () => setIsVisible(false);

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15;
      setPosition({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseout', handleLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseout', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  return (
    <>
      <div
        className="custom-cursor pointer-events-none fixed z-[9999] rounded-full transition-[width,height,opacity] duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '56px' : '32px',
          height: isHovering ? '56px' : '32px',
          marginLeft: isHovering ? '-28px' : '-16px',
          marginTop: isHovering ? '-28px' : '-16px',
          border: '2px solid rgba(45, 255, 176, 0.6)',
          boxShadow: isHovering ? '0 0 20px rgba(16, 230, 138, 0.4)' : '0 0 10px rgba(16, 230, 138, 0.2)',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="custom-cursor-dot pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-accent-400"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          marginLeft: '-4px',
          marginTop: '-4px',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
