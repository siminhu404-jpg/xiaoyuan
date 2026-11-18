import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { ASSET_PATHS } from '../content/assets';
import { ImportedAsset } from '../scene/ImportedAsset';

function Butterfly({ center }: { center: [number, number, number] }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    g.current.position.set(
      center[0] + Math.sin(t * 0.7) * 1.6,
      center[1] + Math.sin(t * 1.3) * 0.4 + 0.2,
      center[2] + Math.sin(t * 0.9 + 1) * 1.2,
    );
    g.current.rotation.y = t * 0.7 + Math.PI / 2;
  });
  return (
    <group ref={g} position={center}>
      <ImportedAsset path={ASSET_PATHS.butterfly} fitHeight={0.32} />
    </group>
  );
}

function FallingLeaf({ origin }: { origin: [number, number, number] }) {
  const m = useRef<THREE.Mesh>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    const fall = (t * 0.3) % 3.5; // 下落 3.5 米，落地后环绕
    m.current.position.set(
      origin[0] + Math.sin(t * 1.2) * 0.6,
      origin[1] - fall,
      origin[2] + Math.cos(t * 0.8) * 0.4,
    );
    m.current.rotation.set(t * 1.5, t, t * 0.7);
  });
  return (
    <mesh ref={m} position={origin}>
      <planeGeometry args={[0.08, 0.05]} />
      <meshBasicMaterial color="#7aa04a" side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function AmbientLife() {
  const lowPerf = useGame((s) => s.lowPerf);
  return (
    <>
      <Butterfly center={[5, 1.2, -8]} />
      {!lowPerf && <Butterfly center={[6, 1.1, 2]} />}
      <FallingLeaf origin={[-3, 3.5, 8]} />
      <FallingLeaf origin={[-2.2, 3.5, 8.5]} />
      {!lowPerf && <FallingLeaf origin={[-3.8, 3.5, 7.6]} />}
    </>
  );
}