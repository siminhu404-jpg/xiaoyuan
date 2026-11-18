import type { Hotspot, HotspotId } from '../content/types';

type HotspotAction =
  | { kind: 'open'; id: HotspotId }
  | { kind: 'move'; id: HotspotId; target: { x: number; z: number } }
  | { kind: 'sit'; id: 'rocking-chair'; target: { x: number; z: number }; seat: { x: number; z: number } }
  | { kind: 'pump'; id: 'pump-well' };

export function getHotspotAction(hotspot: Hotspot): HotspotAction {
  if (hotspot.id === 'gate') {
    return { kind: 'open', id: hotspot.id };
  }
  if (hotspot.id === 'pump-well') {
    return { kind: 'pump', id: hotspot.id };
  }
  if (hotspot.id === 'rocking-chair') {
    return {
      kind: 'sit',
      id: hotspot.id,
      target: { x: hotspot.standAt[0], z: hotspot.standAt[1] },
      seat: { x: hotspot.position[0], z: hotspot.position[1] },
    };
  }

  return {
    kind: 'move',
    id: hotspot.id,
    target: { x: hotspot.standAt[0], z: hotspot.standAt[1] },
  };
}
