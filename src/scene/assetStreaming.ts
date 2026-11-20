import { create } from 'zustand';
import { ASSET_PATHS as A } from '../content/assets';

// Structural assets first, then nearby interactive props, finally decoration.
export const STREAM_ORDER = [
  A.innerCourtyardGate, A.grapevinePergola, A.mainHouse, A.innerSideHouse,
  A.rockingChair, A.pumpWell, A.woodenBench, A.stoneBowl, A.metalBucket, A.woodenStool,
  A.roseBush, A.wallCactus, A.tomatoPlant, A.pepperPlant, A.bokChoy,
  A.greenPlant, A.cabbagePlant, A.threeColorCat, A.blackCat, A.whiteCat,
];
export type AssetStatus = 'loading' | 'ready' | 'failed';
interface StreamingState {
  started: boolean;
  status: Record<string, AssetStatus>;
  start: () => void;
  finish: (path: string, failed?: boolean) => void;
}
export function fillSlots(status: Record<string, AssetStatus>) {
  const next = { ...status };
  let slots = 2 - Object.values(next).filter(s => s === 'loading').length;
  for (const path of STREAM_ORDER) {
    if (slots <= 0) break;
    if (!next[path]) { next[path] = 'loading'; slots--; }
  }
  return next;
}
export const useAssetStreaming = create<StreamingState>((set) => ({
  started: false,
  status: {},
  start: () => set(s => s.started ? s : { started: true, status: fillSlots(s.status) }),
  finish: (path, failed = false) => set(s => {
    if (s.status[path] !== 'loading') return s;
    return { status: fillSlots({ ...s.status, [path]: failed ? 'failed' : 'ready' }) };
  }),
}));
