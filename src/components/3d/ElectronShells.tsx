import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { type ElementInfo } from './chemistryData';

interface ElectronShellsProps {
  element: ElementInfo;
  motionReduced?: boolean;
}

// Shell configurations: radii and orbital speeds
const SHELL_CONFIGS = [
  { radius: 1.45, speed: 2.2, tilt: [0.35, 0.2, 0.1] as [number, number, number] }, // K shell
  { radius: 2.35, speed: 1.35, tilt: [-0.4, 0.45, -0.2] as [number, number, number] }, // L shell
  { radius: 3.25, speed: 0.85, tilt: [0.55, -0.3, 0.4] as [number, number, number] }, // M shell
];

export default function ElectronShells({ element, motionReduced = false }: ElectronShellsProps) {
  const shellsGroupRef = useRef<THREE.Group>(null);

  // Shell data based on element
  const shellsData = useMemo(() => {
    return element.shells.map((count, shellIndex) => {
      const config = SHELL_CONFIGS[shellIndex] || {
        radius: 1.5 + shellIndex * 0.9,
        speed: 1.0 / (shellIndex + 1),
        tilt: [0.3 * shellIndex, -0.2 * shellIndex, 0.1 * shellIndex] as [number, number, number],
      };

      // Generate orbital ring geometry points
      const ringPoints: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPoints.push(
          new THREE.Vector3(
            Math.cos(theta) * config.radius,
            0,
            Math.sin(theta) * config.radius
          )
        );
      }
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints);

      // Electrons base angles
      const electronAngles = Array.from({ length: count }, (_, i) => {
        return (i / count) * Math.PI * 2;
      });

      return {
        shellIndex,
        count,
        radius: config.radius,
        speed: config.speed,
        tilt: config.tilt,
        ringGeometry,
        electronAngles,
      };
    });
  }, [element]);

  return (
    <group ref={shellsGroupRef}>
      {shellsData.map((shell) => (
        <SingleShell
          key={`${element.symbol}-shell-${shell.shellIndex}`}
          shell={shell}
          motionReduced={motionReduced}
        />
      ))}
    </group>
  );
}

interface SingleShellProps {
  shell: {
    shellIndex: number;
    count: number;
    radius: number;
    speed: number;
    tilt: [number, number, number];
    ringGeometry: THREE.BufferGeometry;
    electronAngles: number[];
  };
  motionReduced: boolean;
}

function SingleShell({ shell, motionReduced }: SingleShellProps) {
  const electronGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.LineLoop>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMult = motionReduced ? 0.15 : 1.0;

    // Rotate electrons group around Y axis
    if (electronGroupRef.current) {
      electronGroupRef.current.rotation.y = t * shell.speed * speedMult;
    }

    // Subtle gentle precession of orbital ring
    if (ringRef.current) {
      ringRef.current.rotation.y = Math.sin(t * 0.2 * speedMult) * 0.05;
    }
  });

  // Trail bead offsets (radians behind the electron)
  const trailBeads = useMemo(() => [
    { offset: -0.06, scale: 0.85, opacity: 0.75 },
    { offset: -0.13, scale: 0.65, opacity: 0.5 },
    { offset: -0.21, scale: 0.45, opacity: 0.3 },
    { offset: -0.30, scale: 0.3, opacity: 0.15 },
  ], []);

  // Alternating neon colors between emerald and sky blue
  const electronColor = shell.shellIndex % 2 === 0 ? '#2dffb0' : '#38bdf8';
  const glowColor = shell.shellIndex % 2 === 0 ? '#10e68a' : '#0ea5e9';

  return (
    <group rotation={shell.tilt}>
      {/* 1. Luminous Thin Orbital Ring */}
      {/* Outer subtle glow line */}
      <lineLoop ref={ringRef} geometry={shell.ringGeometry}>
        <lineBasicMaterial
          color={electronColor}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineLoop>

      {/* Thin solid glowing Torus for high-definition rendering */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[shell.radius, 0.008, 12, 64]} />
        <meshBasicMaterial
          color={electronColor}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Orbiting Electrons with Glowing Tails */}
      <group ref={electronGroupRef}>
        {shell.electronAngles.map((baseAngle, eIdx) => {
          const x = Math.cos(baseAngle) * shell.radius;
          const z = Math.sin(baseAngle) * shell.radius;

          return (
            <group key={eIdx}>
              {/* Main Glowing Electron Sphere */}
              <group position={[x, 0, z]}>
                {/* Core particle */}
                <mesh>
                  <sphereGeometry args={[0.075, 16, 16]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive={electronColor}
                    emissiveIntensity={1.8}
                    roughness={0.1}
                    metalness={0.8}
                  />
                </mesh>

                {/* Soft outer glow halo */}
                <mesh>
                  <sphereGeometry args={[0.16, 12, 12]} />
                  <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={0.35}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              </group>

              {/* Trailing Comet Particles (Trail) */}
              {trailBeads.map((bead, bIdx) => {
                const trailAngle = baseAngle + bead.offset;
                const tx = Math.cos(trailAngle) * shell.radius;
                const tz = Math.sin(trailAngle) * shell.radius;

                return (
                  <mesh key={bIdx} position={[tx, 0, tz]}>
                    <sphereGeometry args={[0.065 * bead.scale, 8, 8]} />
                    <meshBasicMaterial
                      color={electronColor}
                      transparent
                      opacity={bead.opacity}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>
    </group>
  );
}
