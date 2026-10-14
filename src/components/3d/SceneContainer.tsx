import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type ElementInfo, type MoleculeInfo } from './chemistryData';
import NucleusCluster from './NucleusCluster';
import ElectronShells from './ElectronShells';
import MoleculeModel from './MoleculeModel';

interface SceneContainerProps {
  mode: 'atom' | 'molecule';
  element: ElementInfo;
  molecule: MoleculeInfo;
  motionReduced: boolean;
}

// Background Floating Quantum Dust Particles
function QuantumParticles({ count = 45 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#2dffb0'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#f5c842'),
    ];

    for (let i = 0; i < count; i++) {
      // Spread across a sphere shell
      const r = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

type SharedRefs = {
  rotation: React.MutableRefObject<{ x: number; y: number }>;
  scroll: React.MutableRefObject<number>;
  dragging: React.MutableRefObject<boolean>;
};

// Interactive Master Controller inside Canvas. All per-frame values live in
// refs - the scene never triggers a React render while it animates.
function InteractiveScene({
  mode,
  element,
  molecule,
  motionReduced,
  refs,
}: {
  mode: 'atom' | 'molecule';
  element: ElementInfo;
  molecule: MoleculeInfo;
  motionReduced: boolean;
  refs: SharedRefs;
}) {
  const masterGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = masterGroupRef.current;
    if (!group) return;

    const { rotation, scroll, dragging } = refs;
    // Gentle auto-advance while the user is not holding the scene.
    if (!motionReduced && !dragging.current) rotation.current.y += 0.003;

    const s = scroll.current;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      rotation.current.x + s * 0.4,
      0.1
    );
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotation.current.y, 0.1);
    group.position.y = THREE.MathUtils.lerp(group.position.y, -s * 0.6, 0.08);
  });

  return (
    <group ref={masterGroupRef}>
      {mode === 'atom' ? (
        <group key={`atom-group-${element.symbol}`}>
          <NucleusCluster element={element} motionReduced={motionReduced} />
          <ElectronShells element={element} motionReduced={motionReduced} />
        </group>
      ) : (
        <group key={`mol-group-${molecule.id}`}>
          <MoleculeModel molecule={molecule} motionReduced={motionReduced} />
        </group>
      )}

      {/* Floating quantum dust */}
      <QuantumParticles count={motionReduced ? 12 : 36} />
    </group>
  );
}

export default function SceneContainer({
  mode,
  element,
  molecule,
  motionReduced,
}: SceneContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: 0.15, y: -0.25 });
  const scrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Pause the render loop whenever the scene is off-screen, and pick lighter
  // GPU settings on touch devices - both are read once, never per frame.
  const [visible, setVisible] = useState(true);
  const [coarse] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax on scroll - writes a ref, so scrolling never re-renders.
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = window.innerHeight || 1;
      scrollRef.current = Math.min(window.scrollY / maxScroll, 1.2);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pointer drag controls (Mouse & Touch) - mutate the ref directly.
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    const r = rotationRef.current;
    r.x = Math.max(-1.2, Math.min(1.2, r.x + dy * 0.008));
    r.y += dx * 0.008;

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const refs: SharedRefs = {
    rotation: rotationRef,
    scroll: scrollRef,
    dragging: isDraggingRef,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* R3F 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 7.2], fov: 46 }}
          gl={{
            antialias: !coarse,
            alpha: true,
            powerPreference: coarse ? 'default' : 'high-performance',
          }}
          dpr={coarse ? [1, 1.5] : [1, 2]}
        >
          {/* Lights */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.6}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, -4, -5]}
            intensity={0.8}
            color="#2dffb0"
          />
          <directionalLight
            position={[4, -3, 3]}
            intensity={0.9}
            color="#38bdf8"
          />

          <InteractiveScene
            mode={mode}
            element={element}
            molecule={molecule}
            motionReduced={motionReduced}
            refs={refs}
          />
        </Canvas>
      </div>

      {/* Visual interaction hint positioned inside the control card area */}
      <div className="absolute bottom-[26%] right-[19%] text-[11px] text-white/40 pointer-events-none flex items-center gap-1.5 z-20 bg-navy-950/60 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
        <span>3D aylantirish uchun suring</span>
      </div>
    </div>
  );
}
