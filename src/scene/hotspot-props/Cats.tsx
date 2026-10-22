import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';

function Cat({ offset, color }: { offset: [number, number, number]; color: string }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = useGame.getState().openHotspot === 'cats';
    if (g.current) {
      // 呼吸起伏（永远在动）+ 被点击时轻微跳一下
      const breathe = Math.sin(t * 1.8 + offset[0]) * 0.015;
      const hop = active ? Math.max(0, Math.sin(t * 6)) * 0.1 : 0;
      g.current.position.y = 1.1 + breathe + hop;
      g.current.rotation.y = offset[0]; // 各自朝向
    }
  });
  return (
    <group ref={g} position={offset}>
      <mesh castShadow userData={{ hotspotId: 'cats' }}>
        <capsuleGeometry args={[0.14, 0.34, 4, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.26, 0.06]} castShadow userData={{ hotspotId: 'cats' }}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[-0.08, 0.3, -0.14]} rotation={[0.4, 0, -0.3]} userData={{ hotspotId: 'cats' }}>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0.08, 0.3, -0.14]} rotation={[0.4, 0, 0.3]} userData={{ hotspotId: 'cats' }}>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function Cats() {
  return (
    <group position={[-6, 0, 1.5]}>
      <Cat offset={[0, 1.1, 0]} color="#e8a04c" />       {/* 慵懒·橙 */}
      <Cat offset={[0.8, 1.1, 0.5]} color="#4a4a4a" />   {/* 警惕·灰 */}
      <Cat offset={[-0.7, 1.1, 0.6]} color="#f0ede6" />  {/* 亲人·白 */}
    </group>
  );
}