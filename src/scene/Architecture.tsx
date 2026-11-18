import { ASSET_PATHS } from '../content/assets';
import { ImportedAsset } from './ImportedAsset';
import { LANDMARKS } from './layout';

function InnerSideHouse({
  position,
  rotation,
}: {
  position: readonly [number, number];
  rotation: number;
}) {
  return (
    <ImportedAsset
      path={ASSET_PATHS.innerSideHouse}
      fitHeight={4.0}
      centerX
      materialStyle="building"
      position={[position[0], 0, position[1]]}
      rotation={[0, rotation, 0]}
    />
  );
}

function MainRoom() {
  const [x, z] = LANDMARKS.mainRoom;

  return (
    <ImportedAsset
      path={ASSET_PATHS.mainHouse}
      fitHeight={5.0}
      fitWidth={11.0}
      centerX
      materialStyle="building"
      position={[x, 0, z]}
    />
  );
}

export default function Architecture() {
  return (
    <>
      <InnerSideHouse
        position={LANDMARKS.westInnerHouse}
        rotation={Math.PI / 2}
      />
      <InnerSideHouse
        position={LANDMARKS.eastInnerHouse}
        rotation={-Math.PI / 2}
      />
      <MainRoom />
    </>
  );
}
