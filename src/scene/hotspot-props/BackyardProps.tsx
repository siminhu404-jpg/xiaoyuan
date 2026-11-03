import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';
import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS, STRUCTURES } from '../layout';

/** 堂屋门帘：装在堂屋南立面中心（LANDMARKS.mainRoom[0], 0, mainRoom 南面 z），curtain 抖动 */
function MainRoomCurtain() {
  const ref = useHotspotAnim('main-room', 'curtain');
  const southFacadeZ = LANDMARKS.mainRoom[1] + STRUCTURES.mainRoom[2] / 2;
  return (
    <group position={[LANDMARKS.mainRoom[0], 0, southFacadeZ]}>
      <group ref={ref} userData={{ hotspotId: 'main-room' }}>
        <mesh position={[-0.7, 1.5, 0]} castShadow userData={{ hotspotId: 'main-room' }}>
          <boxGeometry args={[0.08, 1.9, 0.05]} />
          <meshLambertMaterial color="#4a4638" />
        </mesh>
        <mesh position={[0.7, 1.5, 0]} castShadow userData={{ hotspotId: 'main-room' }}>
          <boxGeometry args={[0.08, 1.9, 0.05]} />
          <meshLambertMaterial color="#4a4638" />
        </mesh>
        <mesh position={[0, 1.2, 0.02]} userData={{ hotspotId: 'main-room' }}>
          <planeGeometry args={[1.4, 2.2]} />
          <meshLambertMaterial color="#b57a5a" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/** 压水井水花粒子（openHotspot === pump-well 时喷水） */
function WaterSplash() {
  const ref = useRef<THREE.Points>(null!);
  const N = 40;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);
  useFrame((state) => {
    const active = useGame.getState().openHotspot === 'pump-well';
    const arr = (ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < N; i++) {
      const seed = i * 7.13;
      const t = state.clock.elapsedTime;
      if (active) {
        arr[i * 3] = Math.sin(seed + t * 3) * 0.25;
        arr[i * 3 + 1] = Math.abs(Math.sin(seed * 2 + t * 4)) * 0.8;
        arr[i * 3 + 2] = Math.cos(seed * 3 + t * 3) * 0.25;
      } else {
        arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 0;
      }
    }
    (ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} position={[LANDMARKS.pumpWell[0], 1.4, LANDMARKS.pumpWell[1]]}><pointsMaterial size={0.06} color="#7ec8e3" /></points>;
}

/** 压水井筒身（可点击） */
function PumpWell() {
  const ref = useHotspotAnim('pump-well', 'water');
  return (
    <group position={[LANDMARKS.pumpWell[0], 0, LANDMARKS.pumpWell[1]]}>
      <group ref={ref} userData={{ hotspotId: 'pump-well' }}>
        <mesh position={[0, 0.5, 0]} castShadow userData={{ hotspotId: 'pump-well' }}>
          <cylinderGeometry args={[0.35, 0.45, 1, 12]} />
          <meshLambertMaterial color="#5a5a5a" />
        </mesh>
        <mesh position={[0.12, 0.85, 0]} castShadow userData={{ hotspotId: 'pump-well' }}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
          <meshLambertMaterial color="#757575" />
        </mesh>
      </group>
    </group>
  );
}

export default function BackyardProps() {
  return (
    <>
      <MainRoomCurtain />
      <PumpWell />
      <WaterSplash />
    </>
  );
}