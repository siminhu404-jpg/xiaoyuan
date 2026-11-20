import { SECTIONS } from './layout';

export type AssetZone = 'frontyard' | 'corridor' | 'backyard';

export function getAssetZone(z: number): AssetZone {
  if (z < SECTIONS.corridor.zMin) return 'backyard';
  if (z < SECTIONS.frontyard.zMin) return 'corridor';
  return 'frontyard';
}
