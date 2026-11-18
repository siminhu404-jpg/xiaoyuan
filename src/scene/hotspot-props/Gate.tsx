import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';
import { ASSET_PATHS } from '../../content/assets';
import { ImportedAsset } from '../ImportedAsset';
import { GATE_FRAME, GATE_POS } from '../layout';

const OPEN_ANGLE = Math.PI / 2;

export default function Gate() {
  const leftLeaf = useRef<THREE.Group>(null!);
  const rightLeaf = useRef<THREE.Group>(null!);
  const openGate = useGame((state) => state.gateOpen);
  const openingHalf = GATE_FRAME.openingWidth / 2;
  const hingeOffset = GATE_FRAME.doorLeafWidth / 2;

  useFrame((_, delta) => {
    const target = openGate ? OPEN_ANGLE : 0;
    if (leftLeaf.current) {
      // 左门从中缝向院内左侧转开。
      leftLeaf.current.rotation.y = THREE.MathUtils.damp(leftLeaf.current.rotation.y, target, 8, delta);
    }
    if (rightLeaf.current) {
      // 右门从中缝向院内右侧转开。
      rightLeaf.current.rotation.y = THREE.MathUtils.damp(rightLeaf.current.rotation.y, -target, 8, delta);
    }
  });

  return (
    <group position={[GATE_POS[0], 0, GATE_POS[1]]}>
      {/* 门框与南侧院墙同高材质，形成完整入口而不是悬空门扇。 */}
      <mesh
        position={[-openingHalf - GATE_FRAME.pillarWidth / 2, GATE_FRAME.height / 2, 0]}
        castShadow
        userData={{ hotspotId: 'gate' }}
      >
        <boxGeometry args={[GATE_FRAME.pillarWidth, GATE_FRAME.height, GATE_FRAME.depth]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>
      <mesh
        position={[openingHalf + GATE_FRAME.pillarWidth / 2, GATE_FRAME.height / 2, 0]}
        castShadow
        userData={{ hotspotId: 'gate' }}
      >
        <boxGeometry args={[GATE_FRAME.pillarWidth, GATE_FRAME.height, GATE_FRAME.depth]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>
      <mesh
        position={[0, GATE_FRAME.height - GATE_FRAME.pillarWidth / 2, 0]}
        castShadow
        userData={{ hotspotId: 'gate' }}
      >
        <boxGeometry args={[GATE_FRAME.openingWidth + GATE_FRAME.pillarWidth * 2, GATE_FRAME.pillarWidth, GATE_FRAME.depth]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>

      {/* 左门使用原始单扇门；右门使用已反向建模的门扇，不再额外旋转。 */}
      <group ref={leftLeaf} position={[-openingHalf, 0, 0]} userData={{ hotspotId: 'gate' }}>
        <ImportedAsset
          path={ASSET_PATHS.outerGateDoor}
          hotspotId="gate"
          fitHeight={GATE_FRAME.doorHeight}
          fitWidth={GATE_FRAME.doorLeafWidth}
          centerX
          materialStyle="wood"
          position={[hingeOffset, 0, 0]}
        />
      </group>
      <group ref={rightLeaf} position={[openingHalf, 0, 0]} userData={{ hotspotId: 'gate' }}>
        <ImportedAsset
          path={ASSET_PATHS.outerGateRightDoor}
          hotspotId="gate"
          fitHeight={GATE_FRAME.doorHeight}
          fitWidth={GATE_FRAME.doorLeafWidth}
          centerX
          materialStyle="wood"
          position={[-hingeOffset, 0, 0]}
        />
      </group>
    </group>
  );
}
