import type { AnimKind, HotspotId, Hotspot, HotspotMap } from './types';

const IDS: readonly HotspotId[] = [
  'gate', 'new-house-west', 'new-house-east', 'jujube-tree',
  'wall-cactus', 'cats', 'grape-vine', 'vegetable-patch',
  'old-door', 'pump-well', 'main-room', 'roses', 'rocking-chair',
];
const ANIMS: readonly AnimKind[] = [
  'shake', 'wobble', 'ripple', 'particles', 'liftDoor', 'curtain',
  'water', 'lightFlow', 'catLazy', 'catAlert', 'catFriendly', 'sit',
];

function fail(msg: string): never {
  throw new Error(`[content] ${msg}`);
}

export function getHotspotMap(json: unknown): HotspotMap {
  if (typeof json !== 'object' || json === null || !Array.isArray((json as HotspotMap).hotspots)) {
    fail('根对象必须含 hotspots 数组');
  }
  const seen = new Set<string>();
  const out: Hotspot[] = [];
  for (const raw of (json as HotspotMap).hotspots) {
    const h = raw as unknown as Record<string, unknown>;
    if (!IDS.includes(h.id as HotspotId)) fail(`未知物件 id: ${String(h.id)}`);
    if (typeof h.label !== 'string' || !h.label) fail(`[${h.id}] label 必须是非空字符串`);
    const pos = h.position, stand = h.standAt;
    if (!Array.isArray(pos) || pos.length !== 2 || pos.some((v) => typeof v !== 'number')) fail(`[${h.id}] position 必须是 [x, z] 数字对`);
    if (!Array.isArray(stand) || stand.length !== 2 || stand.some((v) => typeof v !== 'number')) fail(`[${h.id}] standAt 必须是 [x, z] 数字对`);
    if (!ANIMS.includes(h.anim as AnimKind)) fail(`[${h.id}] 未知 anim 动效类型: ${String(h.anim)}`);
    if (seen.has(h.id as string)) fail(`[${h.id}] id 重复`);
    seen.add(h.id as string);
    let memory: Hotspot['memory'];
    if (h.memory !== undefined) {
      const m = h.memory as Record<string, unknown>;
      if (typeof m.title !== 'string' || !m.title) fail(`[${h.id}] memory.title 必须是非空字符串`);
      if (typeof m.text !== 'string' || !m.text) fail(`[${h.id}] memory.text 必须是非空字符串`);
      if (m.photo !== undefined && typeof m.photo !== 'string') fail(`[${h.id}] memory.photo 必须是字符串`);
      memory = { title: m.title, text: m.text, photo: m.photo as string | undefined };
    }
    out.push({
      id: h.id as HotspotId, label: h.label as string,
      position: pos as unknown as Hotspot['position'],
      standAt: stand as unknown as Hotspot['standAt'],
      anim: h.anim as AnimKind, memory,
    });
  }
  return { hotspots: out };
}