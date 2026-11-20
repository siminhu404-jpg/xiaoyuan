import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useGame } from '../app/store';
import { ASSET_PATHS } from '../content/assets';
import { SECTIONS } from './layout';

export type AssetZone = 'frontyard' | 'corridor' | 'backyard';

type LoadedZones = Record<AssetZone, boolean>;

const ZONE_ASSETS: Record<AssetZone, readonly string[]> = {
  frontyard: [
    ASSET_PATHS.jujubeTree,
    ASSET_PATHS.outerGateDoor,
    ASSET_PATHS.outerGateRightDoor,
    ASSET_PATHS.modernHouse,
  ],
  corridor: [
    ASSET_PATHS.innerCourtyardGate,
    ASSET_PATHS.grapevinePergola,
    ASSET_PATHS.wallCactus,
    ASSET_PATHS.rockingChair,
    ASSET_PATHS.threeColorCat,
    ASSET_PATHS.blackCat,
    ASSET_PATHS.whiteCat,
    ASSET_PATHS.tomatoPlant,
    ASSET_PATHS.pepperPlant,
    ASSET_PATHS.bokChoy,
    ASSET_PATHS.greenPlant,
    ASSET_PATHS.cabbagePlant,
  ],
  backyard: [
    ASSET_PATHS.mainHouse,
    ASSET_PATHS.innerSideHouse,
    ASSET_PATHS.roseBush,
    ASSET_PATHS.pumpWell,
    ASSET_PATHS.woodenBench,
    ASSET_PATHS.stoneBowl,
    ASSET_PATHS.metalBucket,
    ASSET_PATHS.woodenStool,
  ],
};

const prefetched = new Set<string>();

/** Start loading a zone without mounting its models into the scene. */
export function prefetchAssetZone(zone: AssetZone) {
  for (const path of ZONE_ASSETS[zone]) {
    if (prefetched.has(path)) continue;
    prefetched.add(path);
    useGLTF.preload(path, true);
  }
}

export function getAssetZone(z: number): AssetZone {
  if (z < SECTIONS.corridor.zMin) return 'backyard';
  if (z < SECTIONS.frontyard.zMin) return 'corridor';
  return 'frontyard';
}

/**
 * Warms the next zone before the player reaches it. This component only reads
 * the store imperatively, so movement does not re-render the scene tree.
 */
export function AssetPrefetcher() {
  const prefetchedZones = useRef(new Set<AssetZone>());

  useFrame(() => {
    const state = useGame.getState();
    if (state.phase === 'title') return;
    const z = state.kidPos.z;
    const approachingBackyard = z < SECTIONS.corridor.zMin + 5;
    const approachingCorridor = z < SECTIONS.frontyard.zMin + 5;

    if (approachingCorridor && !prefetchedZones.current.has('corridor')) {
      prefetchAssetZone('corridor');
      prefetchedZones.current.add('corridor');
    }
    if (approachingBackyard && !prefetchedZones.current.has('backyard')) {
      prefetchAssetZone('backyard');
      prefetchedZones.current.add('backyard');
    }
  });

  return null;
}

type ZoneLoadState = LoadedZones;

export function useLoadedAssetZones(): ZoneLoadState {
  const zone = useGame((state) => getAssetZone(state.kidPos.z - 5));
  const [loadedZones, setLoadedZones] = useState<LoadedZones>({
    frontyard: true,
    corridor: false,
    backyard: false,
  });

  useEffect(() => {
    setLoadedZones((previous) => (
      previous[zone] ? previous : { ...previous, [zone]: true }
    ));
  }, [zone]);

  return loadedZones;
}
