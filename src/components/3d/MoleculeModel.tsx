import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { type MoleculeInfo } from './chemistryData';

interface MoleculeModelProps {
  molecule: MoleculeInfo;
  motionReduced?: boolean;
}

interface BondStickProps {
  from: [number, number, number];
  to: [number, number, number];
  offsetZ?: number;
  radius?: number;
}

function BondStick({ from, to, offsetZ = 0, radius = 0.06 }: BondStickProps) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const vFrom = new THREE.Vector3(from[0], from[1], from[2] + offsetZ);
    const vTo = new THREE.Vector3(to[0], to[1], to[2] + offsetZ);

    const mid = new THREE.Vector3().addVectors(vFrom, vTo).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(vTo, vFrom);
    const len = dir.length();

    dir.normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

    return {
      midpoint: [mid.x, mid.y, mid.z] as [number, number, number],
      quaternion: quat,
      length: len,
    };
  }, [from, to, offsetZ]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial
        color="#94a3b8"
        roughness={0.25}
        metalness={0.7}
        emissive="#475569"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

export default function MoleculeModel({ molecule, motionReduced = false }: MoleculeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMult = motionReduced ? 0.15 : 1.0;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.35 * speedMult;
      groupRef.current.rotation.x = Math.sin(t * 0.25 * speedMult) * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Bonds (Sticks) */}
      {molecule.bonds.map((bond, bIdx) => {
        const atomA = molecule.atoms[bond.from];
        const atomB = molecule.atoms[bond.to];

        if (bond.type === 'double') {
          return (
            <group key={`bond-double-${bIdx}`}>
              <BondStick
                from={atomA.position}
                to={atomB.position}
                offsetZ={0.08}
                radius={0.045}
              />
              <BondStick
                from={atomA.position}
                to={atomB.position}
                offsetZ={-0.08}
                radius={0.045}
              />
            </group>
          );
        }

        return (
          <BondStick
            key={`bond-single-${bIdx}`}
            from={atomA.position}
            to={atomB.position}
            radius={0.065}
          />
        );
      })}

      {/* 2. Atoms (Balls) */}
      {molecule.atoms.map((atom, aIdx) => (
        <group key={`atom-${aIdx}`} position={atom.position}>
          {/* Main sphere */}
          <mesh>
            <sphereGeometry args={[atom.radius, 32, 32]} />
            <meshStandardMaterial
              color={atom.color}
              roughness={0.2}
              metalness={0.3}
              emissive={atom.color}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Subtle atmospheric sheen */}
          <mesh>
            <sphereGeometry args={[atom.radius * 1.15, 16, 16]} />
            <meshBasicMaterial
              color={atom.color}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Center point light */}
      <pointLight
        position={[0, 0, 0]}
        color="#38bdf8"
        intensity={0.8}
        distance={4}
      />
    </group>
  );
}
