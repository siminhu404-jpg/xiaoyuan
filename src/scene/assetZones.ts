import { useEffect, useState } from 'react';
import { useGame } from '../app/store';
import { SECTIONS } from './layout';

export type AssetZone = 'frontyard' | 'corridor' | 'backyard';

type LoadedZones = Record<AssetZone, boolean>;

export function getAssetZone(z: number): AssetZone {
  if (z < SECTIONS.corridor.zMin) return 'backyard';
  if (z < SECTIONS.frontyard.zMin) return 'corridor';
  return 'frontyard';
}

export function useLoadedAssetZones(): LoadedZones {
  const kidZ = useGame((state) => state.kidPos.z);
  const targetZ = useGame((state) => state.target?.z);
  const zone = getAssetZone(targetZ ?? kidZ);
  const [loadedZones, setLoadedZones] = useState<LoadedZones>({
    frontyard: true,
    corridor: true,
    backyard: false,
  });

  useEffect(() => {
    setLoadedZones((previous) => (
      previous[zone] ? previous : { ...previous, [zone]: true }
    ));
  }, [zone]);

  return loadedZones;
}
