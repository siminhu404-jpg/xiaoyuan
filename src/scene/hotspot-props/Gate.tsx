import { useHotspotAnim } from '../../systems/useHotspotAnim';

export default function Gate() {
  const ref = useHotspotAnim('gate', 'liftDoor');
  return (
    <group position={[0, 0, 18]}>
      <group ref={ref}>
        {/* 两扇门板；userData 标记可交互 */}
        <mesh position={[-0.5, 1, 0]} castShadow userData={{ hotspotId: 'gate' }}>
          <boxGeometry args={[1, 2, 0.12]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
        <mesh position={[0.5, 1, 0]} castShadow userData={{ hotspotId: 'gate' }}>
          <boxGeometry args={[1, 2, 0.12]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
      </group>
    </group>
  );
}