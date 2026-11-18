import * as THREE from 'three';
import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS, STRUCTURES } from '../layout';
import type { HotspotId } from '../../content/types';

/** 新房门：挂在两座现代房屋朝院内的侧立面，curtain 抖动。 */
function NewHouseDoor({
  id,
  position,
  rotation,
}: {
  id: HotspotId;
  position: [number, number, number];
  rotation: number;
}) {
  const ref = useHotspotAnim(id, 'curtain');
  return (
    <group position={position} rotation={[0, rotation, 0]}>
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
  // 旋转后模型的局部宽度沿南北方向，局部深度沿东西方向。
  const innerFacadeOffset = STRUCTURES.modernHouse[2] / 2;
  const westInnerFacadeX = LANDMARKS.westOuterHouse[0] + innerFacadeOffset;
  const eastInnerFacadeX = LANDMARKS.eastOuterHouse[0] - innerFacadeOffset;
  return (
    <>
      <NewHouseDoor
        id="new-house-west"
        position={[westInnerFacadeX, 0, LANDMARKS.westOuterHouse[1]]}
        rotation={Math.PI / 2}
      />
      <NewHouseDoor
        id="new-house-east"
        position={[eastInnerFacadeX, 0, LANDMARKS.eastOuterHouse[1]]}
        rotation={-Math.PI / 2}
      />
    </>
  );
}