import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';

function Butterfly({ center, color }: { center: [number, number, number]; color: string }) {
  const g = useRef<THREE.Group>(null!);
  const wingL = useRef<THREE.Mesh>(null!);
  const wingR = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    g.current.position.set(
      center[0] + Math.sin(t * 0.7) * 1.6,
      center[1] + Math.sin(t * 1.3) * 0.4 + 0.2,
      center[2] + Math.sin(t * 0.9 + 1) * 1.2,
    );
    g.current.rotation.y = t * 0.7 + Math.PI / 2;
    const flap = Math.sin(t * 14) * 0.9;
    wingL.current.rotation.y = flap;
    wingR.current.rotation.y = -flap;
  });
  return (
    <group ref={g} position={center}>
      <mesh ref={wingL} position={[0.06, 0, 0]}>
        <planeGeometry args={[0.14, 0.1]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wingR} position={[-0.06, 0, 0]}>
        <planeGeometry args={[0.14, 0.1]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
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
      <Butterfly center={[5, 1.2, -8]} color="#f2b134" />
      {!lowPerf && <Butterfly center={[6, 1.1, 2]} color="#e88ab0" />}
      <FallingLeaf origin={[-3, 3.5, 8]} />
      <FallingLeaf origin={[-2.2, 3.5, 8.5]} />
      {!lowPerf && <FallingLeaf origin={[-3.8, 3.5, 7.6]} />}
    </>
  );
}