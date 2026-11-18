import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';
import { ASSET_PATHS } from '../../content/assets';
import { ImportedAsset } from '../ImportedAsset';

export const COURTYARD_PROP_PLACEMENTS = {
  bed: [-5.6, -6.4] as const,
  pumpWell: [5.6, -4.8] as const,
  bowl: [5.8, -4.05] as const,
  bucket: [6.5, -5.5] as const,
  stool: [4.5, -5.1] as const,
};

export const PUMP_WATER_NOZZLE_LOCAL = [0.04, 0.53, 0.02] as const;

export function getPumpWaterState(elapsed: number, duration = 1) {
  return elapsed >= 0 && elapsed < duration ? 'active' : 'idle';
}

function BucketFallback() {
  return (
    <mesh position={[0, 0.25, 0]} castShadow>
      <cylinderGeometry args={[0.28, 0.34, 0.5, 12]} />
      <meshLambertMaterial color="#687078" />
    </mesh>
  );
}

function StoolFallback() {
  return (
    <mesh position={[0, 0.25, 0]} castShadow>
      <cylinderGeometry args={[0.32, 0.32, 0.5, 10]} />
      <meshLambertMaterial color="#8a5a38" />
    </mesh>
  );
}

function StoneBowlFallback() {
  return (
    <mesh position={[0, 0.12, 0]} castShadow>
      <cylinderGeometry args={[0.38, 0.3, 0.24, 16]} />
      <meshLambertMaterial color="#8b8275" />
    </mesh>
  );
}

function DriedGrain() {
  const kernels = [
    [-0.55, -0.22], [-0.35, -0.1], [-0.12, -0.24], [0.12, -0.12], [0.36, -0.22], [0.58, -0.08],
    [-0.5, 0.08], [-0.26, 0.2], [0, 0.08], [0.25, 0.22], [0.48, 0.1],
  ] as const;
  return (
    <group position={[0, 0.51, 0]}>
      {kernels.map(([x, z], index) => (
        <mesh key={index} position={[x, 0, z]} rotation={[0.1, index * 0.7, 0]} castShadow>
          <boxGeometry args={[0.18, 0.045, 0.11]} />
          <meshLambertMaterial color={index % 3 === 0 ? '#d6ae4b' : '#b8872f'} />
        </mesh>
      ))}
    </group>
  );
}

function CourtyardFurniture() {
  return (
    <>
      {/* 凉床靠近西侧房屋，避免占用中间通道。 */}
      <group position={[COURTYARD_PROP_PLACEMENTS.bed[0], 0, COURTYARD_PROP_PLACEMENTS.bed[1]]} rotation={[0, Math.PI / 2, 0]}>
        <Suspense fallback={<StoolFallback />}>
          <ImportedAsset path={ASSET_PATHS.woodenBench} fitHeight={0.48} centerX materialStyle="wood" />
        </Suspense>
        <DriedGrain />
      </group>
      <group
        position={[COURTYARD_PROP_PLACEMENTS.bowl[0], 0, COURTYARD_PROP_PLACEMENTS.bowl[1]]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <Suspense fallback={<StoneBowlFallback />}>
          <ImportedAsset path={ASSET_PATHS.stoneBowl} fitWidth={1.1} centerX />
        </Suspense>
      </group>
      <group position={[COURTYARD_PROP_PLACEMENTS.bucket[0], 0, COURTYARD_PROP_PLACEMENTS.bucket[1]]}>
        <Suspense fallback={<BucketFallback />}>
          <ImportedAsset path={ASSET_PATHS.metalBucket} fitHeight={0.45} centerX />
        </Suspense>
      </group>
      <group position={[COURTYARD_PROP_PLACEMENTS.stool[0], 0, COURTYARD_PROP_PLACEMENTS.stool[1]]}>
        <Suspense fallback={<StoolFallback />}>
          <ImportedAsset path={ASSET_PATHS.woodenStool} fitHeight={0.5} centerX materialStyle="wood" />
        </Suspense>
      </group>
    </>
  );
}

function WaterSplash() {
  const ref = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const pulseStartedAt = useRef<number | null>(null);
  const lastPulse = useRef(0);
  const waterStart = useMemo(
    () => new THREE.Vector3(...PUMP_WATER_NOZZLE_LOCAL),
    [],
  );
  const waterTarget = useMemo(
    () => new THREE.Vector3(
      COURTYARD_PROP_PLACEMENTS.bowl[0] - COURTYARD_PROP_PLACEMENTS.pumpWell[0],
      0.22,
      COURTYARD_PROP_PLACEMENTS.bowl[1] - COURTYARD_PROP_PLACEMENTS.pumpWell[1],
    ),
    [],
  );
  const streamCurve = useMemo(() => {
    const midpoint = waterStart.clone().lerp(waterTarget, 0.52);
    midpoint.y += 0.08;
    return new THREE.CatmullRomCurve3(
      [waterStart, midpoint, waterTarget],
      false,
      'centripetal',
      0.35,
    );
  }, [waterStart, waterTarget]);

  useFrame((state) => {
    const pulse = useGame.getState().pumpPulse;
    if (pulse !== lastPulse.current) {
      lastPulse.current = pulse;
      pulseStartedAt.current = state.clock.elapsedTime;
    }
    const elapsed = pulseStartedAt.current === null
      ? Number.POSITIVE_INFINITY
      : state.clock.elapsedTime - pulseStartedAt.current;
    const progress = Math.min(1, elapsed / 0.18);
    if (!materialRef.current) return;
    materialRef.current.opacity = getPumpWaterState(elapsed) === 'active'
      ? 0.82 * progress
      : 0;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <tubeGeometry args={[streamCurve, 24, 0.045, 8, false]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#a9e5ed"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

function PumpWell() {
  const pumpRef = useRef<THREE.Group>(null!);
  const pulseStartedAt = useRef<number | null>(null);
  const lastPulse = useRef(0);

  useFrame((state) => {
    const pulse = useGame.getState().pumpPulse;
    if (pulse !== lastPulse.current) {
      lastPulse.current = pulse;
      pulseStartedAt.current = state.clock.elapsedTime;
    }
    const elapsed = pulseStartedAt.current === null
      ? Number.POSITIVE_INFINITY
      : state.clock.elapsedTime - pulseStartedAt.current;
    const active = getPumpWaterState(elapsed) === 'active';
    if (pumpRef.current) {
      const progress = active ? Math.min(1, elapsed / 0.22) : 0;
      pumpRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.055;
    }
  });

  return (
    <group position={[COURTYARD_PROP_PLACEMENTS.pumpWell[0], 0, COURTYARD_PROP_PLACEMENTS.pumpWell[1]]}>
      <group ref={pumpRef} userData={{ hotspotId: 'pump-well' }}>
        <ImportedAsset path={ASSET_PATHS.pumpWell} hotspotId="pump-well" fitHeight={1.2} centerX />
        <WaterSplash />
      </group>
    </group>
  );
}

export default function CourtyardProps() {
  return (
    <>
      <CourtyardFurniture />
      <PumpWell />
    </>
  );
}
