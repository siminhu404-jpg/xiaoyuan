import * as THREE from 'three';
import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS, STRUCTURES } from '../layout';

/** 堂屋门帘：装在堂屋南立面中心，curtain 抖动。 */
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

export default function BackyardProps() {
  return <MainRoomCurtain />;
}
