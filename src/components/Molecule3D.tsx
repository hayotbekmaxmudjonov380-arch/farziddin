import { useEffect, useRef, useState } from 'react';

export default function Molecule3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -15, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight;
      setScrollProgress(Math.min(scrolled / maxScroll, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    const autoRotate = () => {
      if (!isDraggingRef.current) {
        autoRotateRef.current += 0.3;
        setRotation((prev) => ({ ...prev, y: prev.y + 0.3 }));
      }
      rafId = requestAnimationFrame(autoRotate);
    };
    rafId = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    setRotation((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5,
    }));
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const scale = 1 - scrollProgress * 0.3;
  const translateY = scrollProgress * 50;

  const atoms = [
    { id: 0, x: 0, y: 0, z: 0, size: 50, color: '#2dffb0', glow: 'rgba(16, 230, 138, 0.6)' },
    { id: 1, x: 90, y: -40, z: 40, size: 32, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
    { id: 2, x: -90, y: -40, z: 40, size: 32, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
    { id: 3, x: 0, y: 80, z: -40, size: 36, color: '#f5c842', glow: 'rgba(245, 200, 66, 0.5)' },
    { id: 4, x: 70, y: 50, z: 60, size: 24, color: '#2dffb0', glow: 'rgba(16, 230, 138, 0.4)' },
    { id: 5, x: -70, y: 50, z: 60, size: 24, color: '#2dffb0', glow: 'rgba(16, 230, 138, 0.4)' },
  ];

  const bonds = [
    [0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 4], [3, 5],
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ perspective: '800px', transform: `scale(${scale}) translateY(${translateY}px)` }}
    >
      <div
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          width: '280px',
          height: '280px',
          transition: isDraggingRef.current ? 'none' : 'transform 0.05s linear',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Bonds */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
          {bonds.map(([a, b], i) => {
            const atomA = atoms[a];
            const atomB = atoms[b];
            return (
              <line
                key={i}
                x1={140 + atomA.x}
                y1={140 + atomA.y}
                x2={140 + atomB.x}
                y2={140 + atomB.y}
                stroke="rgba(45, 255, 176, 0.25)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Atoms */}
        {atoms.map((atom) => (
          <div
            key={atom.id}
            className="absolute rounded-full"
            style={{
              left: `${140 + atom.x - atom.size / 2}px`,
              top: `${140 + atom.y - atom.size / 2}px`,
              width: `${atom.size}px`,
              height: `${atom.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${atom.color}, ${atom.color}88)`,
              boxShadow: `0 0 ${atom.size * 0.8}px ${atom.glow}, inset 0 0 ${atom.size * 0.3}px rgba(255,255,255,0.3)`,
              transform: `translateZ(${atom.z}px)`,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="absolute rounded-full bg-white/40"
              style={{
                top: '20%',
                left: '20%',
                width: '25%',
                height: '25%',
                filter: 'blur(4px)',
              }}
            />
          </div>
        ))}

        {/* Outer electron rings */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-accent-400/20"
          style={{
            width: '260px',
            height: '260px',
            marginLeft: '-130px',
            marginTop: '-130px',
            transform: 'rotateX(75deg)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-neon-400/20"
          style={{
            width: '260px',
            height: '260px',
            marginLeft: '-130px',
            marginTop: '-130px',
            transform: 'rotateY(75deg)',
          }}
        />
      </div>

      {/* Glow halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 230, 138, 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
