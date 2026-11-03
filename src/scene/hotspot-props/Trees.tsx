import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS } from '../layout';

export function JujubeTree() {
  const ref = useHotspotAnim('jujube-tree', 'shake');
  return (
    <group position={[LANDMARKS.jujubeTree[0], 0, LANDMARKS.jujubeTree[1]]}>
      <group ref={ref} userData={{ hotspotId: 'jujube-tree' }}>
        <mesh position={[0, 1.5, 0]} castShadow userData={{ hotspotId: 'jujube-tree' }}>
          <cylinderGeometry args={[0.28, 0.4, 3, 8]} />
          <meshLambertMaterial color="#6b4f2f" />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow userData={{ hotspotId: 'jujube-tree' }}>
          <sphereGeometry args={[1.6, 12, 10]} />
          <meshLambertMaterial color="#4a7a2e" />
        </mesh>
      </group>
    </group>
  );
}

/** 单丛月季（一个 hotspot: roses，东西两丛共用同一记忆卡） */
function RoseBush({ position }: { position: readonly [number, number, number] }) {
  const ref = useHotspotAnim('roses', 'wobble');
  return (
    <group position={position}>
      <group ref={ref} userData={{ hotspotId: 'roses' }}>
        <mesh position={[0, 0.45, 0]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.55, 10, 8]} />
          <meshLambertMaterial color="#3f6b2a" />
        </mesh>
        <mesh position={[0.18, 0.85, 0.1]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshLambertMaterial color="#d4547a" />
        </mesh>
        <mesh position={[-0.2, 0.8, -0.1]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshLambertMaterial color="#d4547a" />
        </mesh>
      </group>
    </group>
  );
}

export function Roses() {
  return (
    <>
      <RoseBush position={[5, 0, -8]} />
      <RoseBush position={[-5, 0, -8]} />
    </>
  );
}