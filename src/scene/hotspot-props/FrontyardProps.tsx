import * as THREE from 'three';
import { useHotspotAnim } from '../../systems/useHotspotAnim';
import type { HotspotId } from '../../content/types';

/** 新房门：挂在房屋南立面（新房为 [-7,1.8,13]/[7,1.8,13]，南面 z≈10），curtain 抖动 */
function NewHouseDoor({ id, position }: { id: HotspotId; position: [number, number, number] }) {
  const ref = useHotspotAnim(id, 'curtain');
  return (
    <group position={position}>
      <group ref={ref} userData={{ hotspotId: id }}>
        <mesh position={[-0.6, 1.3, 0]} castShadow userData={{ hotspotId: id }}>
          <boxGeometry args={[0.09, 2.1, 0.06]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
        <mesh position={[0.6, 1.3, 0]} castShadow userData={{ hotspotId: id }}>
          <boxGeometry args={[0.09, 2.1, 0.06]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
        <mesh position={[0, 2.45, 0]} castShadow userData={{ hotspotId: id }}>
          <boxGeometry args={[1.29, 0.09, 0.06]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
        {/* 门帘 */}
        <mesh position={[0, 1.15, 0.02]} userData={{ hotspotId: id }}>
          <planeGeometry args={[1.2, 2.0]} />
          <meshLambertMaterial color="#c98c6a" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function FrontyardProps() {
  return (
    <>
      <NewHouseDoor id="new-house-west" position={[-7, 0, 10]} />
      <NewHouseDoor id="new-house-east" position={[7, 0, 10]} />
    </>
  );
}