import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS } from '../layout';
import { ImportedAsset } from '../ImportedAsset';

function JujubeTreeModel({ position }: { position: readonly [number, number] }) {
  const ref = useHotspotAnim('jujube-tree', 'shake');
  return (
    <group position={[position[0], 0, position[1]]}>
      <group ref={ref} userData={{ hotspotId: 'jujube-tree' }}>
        <ImportedAsset
          path="/assets/jujube-tree.glb"
          hotspotId="jujube-tree"
          fitHeight={4}
          materialStyle="plant"
        />
      </group>
    </group>
  );
}

export function JujubeTree() {
  return (
    <>
      <JujubeTreeModel position={LANDMARKS.westJujubeTree} />
      <JujubeTreeModel position={LANDMARKS.jujubeTree} />
    </>
  );
}

/** 两丛月季共用同一个热点和正式 GLB 资产。 */
function RoseBush({ position }: { position: readonly [number, number, number] }) {
  const ref = useHotspotAnim('roses', 'wobble');
  return (
    <group position={position}>
      <group ref={ref} userData={{ hotspotId: 'roses' }}>
        <ImportedAsset
          path="/assets/rose-bush.glb"
          hotspotId="roses"
          fitHeight={1.8}
          materialStyle="plant"
        />
      </group>
    </group>
  );
}

export function Roses() {
  return (
    <>
      <RoseBush position={[LANDMARKS.eastRoses[0], 0, LANDMARKS.eastRoses[1]]} />
      <RoseBush position={[LANDMARKS.westRoses[0], 0, LANDMARKS.westRoses[1]]} />
    </>
  );
}
