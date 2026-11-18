import { ASSET_PATHS } from '../content/assets';
import { LANDMARKS, OUTER_HOUSE_ROTATIONS, STRUCTURES } from './layout';
import { ImportedAsset } from './ImportedAsset';

function ModernHouse({
  position,
  rotation,
}: {
  position: readonly [number, number];
  rotation: number;
}) {
  return (
    <ImportedAsset
      path={ASSET_PATHS.modernHouse}
      fitHeight={STRUCTURES.modernHouse[1]}
      centerX
      materialStyle="building"
      position={[position[0], 0, position[1]]}
      rotation={[0, rotation, 0]}
    />
  );
}

export default function ModernHouses() {
  return (
    <>
      <ModernHouse position={LANDMARKS.westOuterHouse} rotation={OUTER_HOUSE_ROTATIONS.west} />
      <ModernHouse position={LANDMARKS.eastOuterHouse} rotation={OUTER_HOUSE_ROTATIONS.east} />
    </>
  );
}
