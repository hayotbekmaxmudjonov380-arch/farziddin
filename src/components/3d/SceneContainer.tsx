import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

// Background Floating Quantum Dust Particles — dynamically scaled for device power
function QuantumParticles({ count = 36 }: { count?: number }) {
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
      const r = 3.2 + Math.random() * 4.2;
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
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.06;
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
        size={0.055}
        vertexColors
        transparent
        opacity={0.6}
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

// Interactive Master Controller inside Canvas with dynamic viewport-aware scaling
function InteractiveScene({
  mode,
  element,
  molecule,
  motionReduced,
  isLowEnd,
  refs,
}: {
  mode: 'atom' | 'molecule';
  element: ElementInfo;
  molecule: MoleculeInfo;
  motionReduced: boolean;
  isLowEnd: boolean;
  refs: SharedRefs;
}) {
  const masterGroupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Calculate target scale so the outermost electron orbit always fits within ~88-90% of the canvas width
  const targetScale = useMemo(() => {
    const maxShellRadius =
      mode === 'atom'
        ? element.shells.length === 3
          ? 3.35
          : element.shells.length === 2
          ? 2.45
          : 1.55
        : 2.2;

    const outerRadius = maxShellRadius + 0.35; // margin for electron beads and outer glow
    const aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
    const fovRad = (46 * Math.PI) / 360;
    const visibleHeight = 2 * 7.2 * Math.tan(fovRad); // ~6.11 units at camera distance 7.2
    const visibleWidth = visibleHeight * aspect;
    const minVisible = Math.min(visibleWidth, visibleHeight);

    // Keep outer diameter strictly within 88% of the minimum visible viewport dimension
    const scale = (minVisible * 0.88) / (2 * outerRadius);
    return Math.min(1.05, Math.max(0.48, scale));
  }, [mode, element, size.width, size.height]);

  useFrame(() => {
    const group = masterGroupRef.current;
    if (!group) return;

    const { rotation, scroll, dragging } = refs;
    // Gentle auto-rotation when user is not actively interacting
    if (!motionReduced && !dragging.current) {
      rotation.current.y += 0.003;
    }

    const s = scroll.current;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      rotation.current.x + s * 0.35,
      0.1
    );
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotation.current.y, 0.1);
    group.position.y = THREE.MathUtils.lerp(group.position.y, -s * 0.5, 0.08);

    // Smooth lerp to the responsive scale
    const currentScale = group.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    group.scale.setScalar(nextScale);
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
      <QuantumParticles count={motionReduced ? 10 : isLowEnd ? 16 : 36} />
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
  const startPointerRef = useRef({ x: 0, y: 0 });
  const touchModeRef = useRef<'undecided' | 'rotate' | 'scroll'>('undecided');

  const [visible, setVisible] = useState(true);
  const [showHint, setShowHint] = useState(true);

  // Detect coarse pointer or low-concurrency device
  const [isLowEnd] = useState(() => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowCores =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency != null &&
      navigator.hardwareConcurrency <= 4;
    return coarse || lowCores;
  });

  // Auto-hide the 3D drag hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Pause render loop when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = window.innerHeight || 1;
      scrollRef.current = Math.min(window.scrollY / maxScroll, 1.2);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pointer drag controls (Mouse & Touch with vertical page scroll passthrough)
  const handlePointerDown = (e: React.PointerEvent) => {
    setShowHint(false);
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    startPointerRef.current = { x: e.clientX, y: e.clientY };

    if (e.pointerType === 'mouse') {
      touchModeRef.current = 'rotate';
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    } else {
      // For touch, defer capturing until gesture direction (horizontal vs vertical) is determined
      touchModeRef.current = 'undecided';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    if (e.pointerType === 'touch') {
      if (touchModeRef.current === 'undecided') {
        const totalDx = Math.abs(e.clientX - startPointerRef.current.x);
        const totalDy = Math.abs(e.clientY - startPointerRef.current.y);

        if (totalDx > 6 || totalDy > 6) {
          if (totalDy > totalDx) {
            // User is scrolling vertically down the page — release 3D drag so native page scroll continues
            touchModeRef.current = 'scroll';
            isDraggingRef.current = false;
            return;
          } else {
            // User is swiping horizontally to rotate the atom
            touchModeRef.current = 'rotate';
            try {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            } catch {
              // Safe fallback
            }
          }
        } else {
          return;
        }
      }

      if (touchModeRef.current === 'scroll') {
        return;
      }

      // Horizontal swipe rotates only around the vertical Y-axis on mobile
      const r = rotationRef.current;
      r.y += dx * 0.009;
    } else {
      // Desktop mouse allows full 2-axis orbit
      const r = rotationRef.current;
      r.x = Math.max(-1.2, Math.min(1.2, r.x + dy * 0.008));
      r.y += dx * 0.008;
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    touchModeRef.current = 'undecided';
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Safe fallback
    }
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
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* R3F 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 7.2], fov: 46 }}
          gl={{
            antialias: !isLowEnd,
            alpha: true,
            powerPreference: isLowEnd ? 'low-power' : 'high-performance',
          }}
          dpr={isLowEnd ? [1, 1.25] : [1, 1.75]}
        >
          {/* Lights */}
          <ambientLight intensity={0.85} />
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
            isLowEnd={isLowEnd}
            refs={refs}
          />
        </Canvas>
      </div>

      {/* Visual interaction hint positioned neatly at the bottom edge */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/50 pointer-events-none flex items-center gap-1.5 z-20 bg-navy-950/70 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md transition-opacity duration-700 ${
          showHint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
        <span>3D aylantirish uchun suring</span>
      </div>
    </div>
  );
}
