import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { type ElementInfo } from './chemistryData';

interface NucleusClusterProps {
  element: ElementInfo;
  motionReduced?: boolean;
}

export default function NucleusCluster({ element, motionReduced = false }: NucleusClusterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const protonMeshRef = useRef<THREE.InstancedMesh>(null);
  const neutronMeshRef = useRef<THREE.InstancedMesh>(null);

  const { protonCount, neutronCount, protonPositions, neutronPositions } = useMemo(() => {
    const pCount = element.atomicNumber;
    const nCount = element.neutrons;
    const total = pCount + nCount;

    if (total === 1) {
      return {
        protonCount: 1,
        neutronCount: 0,
        protonPositions: [[0, 0, 0] as [number, number, number]],
        neutronPositions: [] as [number, number, number][],
      };
    }

    // Dense spherical Fibonacci packing
    const allPositions: [number, number, number][] = [];
    const clusterRadius = 0.22 * Math.cbrt(total);

    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const goldenAngle = i * 2.39996323; // Golden angle in radians

      const x = Math.cos(goldenAngle) * radiusAtY;
      const z = Math.sin(goldenAngle) * radiusAtY;

      // Radial distribution for volume packing rather than hollow shell
      const rScale = clusterRadius * (0.42 + 0.58 * Math.cbrt((i + 1) / total));

      allPositions.push([x * rScale, y * rScale, z * rScale]);
    }

    // Interleave protons and neutrons evenly throughout the cluster
    const pPos: [number, number, number][] = [];
    const nPos: [number, number, number][] = [];

    // Distribute with balanced ratio
    let pAssigned = 0;
    let nAssigned = 0;

    for (let i = 0; i < total; i++) {
      const wantProton = (pAssigned / pCount) <= (nAssigned / Math.max(1, nCount));
      if ((wantProton && pAssigned < pCount) || nAssigned >= nCount) {
        pPos.push(allPositions[i]);
        pAssigned++;
      } else {
        nPos.push(allPositions[i]);
        nAssigned++;
      }
    }

    return {
      protonCount: pCount,
      neutronCount: nCount,
      protonPositions: pPos,
      neutronPositions: nPos,
    };
  }, [element]);

  // Temporary Three.js math objects
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMult = motionReduced ? 0.2 : 1.0;

    // Gentle rotation of the whole nucleus
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25 * speedMult;
      groupRef.current.rotation.x = Math.sin(t * 0.2 * speedMult) * 0.15;
    }

    // Micro-vibration of individual protons
    if (protonMeshRef.current) {
      for (let i = 0; i < protonCount; i++) {
        const [baseX, baseY, baseZ] = protonPositions[i];
        const jiggle = motionReduced ? 0.003 : 0.015;
        const dx = Math.sin(t * 8 * speedMult + i * 1.7) * jiggle;
        const dy = Math.cos(t * 7 * speedMult + i * 2.1) * jiggle;
        const dz = Math.sin(t * 9 * speedMult + i * 1.3) * jiggle;

        tempObject.position.set(baseX + dx, baseY + dy, baseZ + dz);
        tempObject.scale.setScalar(1);
        tempObject.updateMatrix();
        protonMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      protonMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Micro-vibration of individual neutrons
    if (neutronMeshRef.current && neutronCount > 0) {
      for (let i = 0; i < neutronCount; i++) {
        const [baseX, baseY, baseZ] = neutronPositions[i];
        const jiggle = motionReduced ? 0.003 : 0.015;
        const dx = Math.cos(t * 7.5 * speedMult + i * 2.3) * jiggle;
        const dy = Math.sin(t * 8.5 * speedMult + i * 1.9) * jiggle;
        const dz = Math.cos(t * 6.5 * speedMult + i * 2.7) * jiggle;

        tempObject.position.set(baseX + dx, baseY + dy, baseZ + dz);
        tempObject.scale.setScalar(1);
        tempObject.updateMatrix();
        neutronMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      neutronMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Nucleon radius
  const nucleonRadius = element.atomicNumber === 1 ? 0.22 : 0.15;

  return (
    <group ref={groupRef}>
      {/* Central energy aura/pointlight inside the nucleus */}
      <pointLight
        color={element.glowColor}
        intensity={1.2}
        distance={3.5}
        decay={2}
      />

      {/* Protons: Crimson Red, glowing highlights */}
      <instancedMesh
        ref={protonMeshRef}
        args={[undefined, undefined, protonCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[nucleonRadius, 24, 24]} />
        <meshStandardMaterial
          color="#ef4444"
          roughness={0.25}
          metalness={0.3}
          emissive="#b91c1c"
          emissiveIntensity={0.35}
        />
      </instancedMesh>

      {/* Neutrons: Slate Gray / Platinum sheen */}
      {neutronCount > 0 && (
        <instancedMesh
          ref={neutronMeshRef}
          args={[undefined, undefined, neutronCount]}
          frustumCulled={false}
        >
          <sphereGeometry args={[nucleonRadius, 24, 24]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.35}
            metalness={0.65}
            emissive="#334155"
            emissiveIntensity={0.2}
          />
        </instancedMesh>
      )}

      {/* Nuclear binding force field core glow */}
      <mesh>
        <sphereGeometry args={[nucleonRadius * 1.5 + 0.1 * Math.cbrt(element.atomicNumber), 16, 16]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
