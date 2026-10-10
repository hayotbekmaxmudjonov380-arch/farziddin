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

// Interactive Master Controller inside Canvas
function InteractiveScene({
  mode,
  element,
  molecule,
  motionReduced,
  scrollOffset,
  rotation,
}: {
  mode: 'atom' | 'molecule';
  element: ElementInfo;
  molecule: MoleculeInfo;
  motionReduced: boolean;
  scrollOffset: number;
  rotation: { x: number; y: number };
}) {
  const masterGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (masterGroupRef.current) {
      // Smoothly interpolate user drag rotation + scroll parallax
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        rotation.x + scrollOffset * 0.4,
        0.1
      );
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        rotation.y,
        0.1
      );

      // Parallax Y offset
      masterGroupRef.current.position.y = THREE.MathUtils.lerp(
        masterGroupRef.current.position.y,
        -scrollOffset * 0.6,
        0.08
      );
    }
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
      <QuantumParticles count={motionReduced ? 20 : 45} />
    </group>
  );
}

export default function SceneContainer({
  mode,
  element,
  molecule,
  motionReduced,
}: SceneContainerProps) {
  const [rotation, setRotation] = useState({ x: 0.15, y: -0.25 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1.2);
      setScrollOffset(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth gentle auto-rotation when user is not dragging
  useEffect(() => {
    if (motionReduced) return;
    let animId = 0;
    const tick = () => {
      if (!isDraggingRef.current) {
        setRotation((prev) => ({
          ...prev,
          y: prev.y + 0.003,
        }));
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [motionReduced]);

  // Pointer drag controls (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    setRotation((prev) => ({
      x: Math.max(-1.2, Math.min(1.2, prev.x + dy * 0.008)),
      y: prev.y + dx * 0.008,
    }));

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* R3F 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 46 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
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
            scrollOffset={scrollOffset}
            rotation={rotation}
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
