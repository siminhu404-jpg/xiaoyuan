import { useHotspotAnim } from '../../systems/useHotspotAnim';

/** 老院门：门框 + 半透明光影平面（lightFlow 动效驱动 children[0]）。位置 z=-2 在围墙内测 */
function OldDoor() {
  const ref = useHotspotAnim('old-door', 'lightFlow');
  return (
    <group position={[0, 0, -2]}>
      <group ref={ref}>
        <mesh position={[0, 1.2, 0]} userData={{ hotspotId: 'old-door' }}>
          <planeGeometry args={[1.6, 2.4]} />
          <meshLambertMaterial color="#cfe0ff" transparent opacity={0.18} />
        </mesh>
        <mesh position={[-0.9, 1.2, -0.1]} castShadow userData={{ hotspotId: 'old-door' }}>
          <boxGeometry args={[0.16, 2.4, 0.16]} />
          <meshLambertMaterial color="#5a4630" />
        </mesh>
        <mesh position={[0.9, 1.2, -0.1]} castShadow userData={{ hotspotId: 'old-door' }}>
          <boxGeometry args={[0.16, 2.4, 0.16]} />
          <meshLambertMaterial color="#5a4630" />
        </mesh>
        <mesh position={[0, 2.45, -0.1]} castShadow userData={{ hotspotId: 'old-door' }}>
          <boxGeometry args={[1.96, 0.16, 0.16]} />
          <meshLambertMaterial color="#5a4630" />
        </mesh>
      </group>
    </group>
  );
}

/** 墙头仙人掌：站在围墙顶上（墙顶 y≈2.2），wobble 低频大幅摇摆 */
function WallCactus() {
  const ref = useHotspotAnim('wall-cactus', 'wobble');
  return (
    <group position={[0, 0, 0.2]}>
      <group ref={ref} position={[0, 2.2, 0]} userData={{ hotspotId: 'wall-cactus' }}>
        <mesh position={[0, 0.5, 0]} castShadow userData={{ hotspotId: 'wall-cactus' }}>
          <cylinderGeometry args={[0.3, 0.35, 1, 8]} />
          <meshLambertMaterial color="#3f7d3a" />
        </mesh>
        <mesh position={[0.4, 0.9, 0]} rotation-z={0.3} castShadow userData={{ hotspotId: 'wall-cactus' }}>
          <cylinderGeometry args={[0.16, 0.2, 0.5, 8]} />
          <meshLambertMaterial color="#4a9443" />
        </mesh>
        <mesh position={[-0.4, 0.85, 0]} rotation-z={-0.3} castShadow userData={{ hotspotId: 'wall-cactus' }}>
          <cylinderGeometry args={[0.16, 0.2, 0.5, 8]} />
          <meshLambertMaterial color="#4a9443" />
        </mesh>
      </group>
    </group>
  );
}

/** 葡萄藤：藤柱 + 廊架横梁，shake 高频小摇摆 */
function GrapeVine() {
  const ref = useHotspotAnim('grape-vine', 'shake');
  return (
    <group position={[8.8, 0, 0]}>
      <group ref={ref} userData={{ hotspotId: 'grape-vine' }}>
        <mesh position={[0, 1.3, 0]} castShadow userData={{ hotspotId: 'grape-vine' }}>
          <cylinderGeometry args={[0.16, 0.2, 2.6, 8]} />
          <meshLambertMaterial color="#6b4f2f" />
        </mesh>
        {/* 横梁（往西探向院内） */}
        <mesh position={[-1.5, 2.7, 0.2]} rotation-y={Math.PI / 2} castShadow userData={{ hotspotId: 'grape-vine' }}>
          <boxGeometry args={[3, 0.18, 0.18]} />
          <meshLambertMaterial color="#6b4f2f" />
        </mesh>
      </group>
    </group>
  );
}

/** 菜地：在已有菜地土箱上铺几排低矮作物，ripple 呼吸 */
function VegetablePatch() {
  const ref = useHotspotAnim('vegetable-patch', 'ripple');
  return (
    <group position={[6, 0, 2]}>
      <group ref={ref} userData={{ hotspotId: 'vegetable-patch' }}>
        {[-1.1, 0, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 0.22, 0]} castShadow userData={{ hotspotId: 'vegetable-patch' }}>
            <boxGeometry args={[1.7, 0.35, 0.5]} />
            <meshLambertMaterial color="#5f7a3d" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function CorridorProps() {
  return (
    <>
      <OldDoor />
      <WallCactus />
      <GrapeVine />
      <VegetablePatch />
    </>
  );
}