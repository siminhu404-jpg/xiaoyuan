/** 场地边界（米）。x: 东西（东+），z: 南北（北-，南+） */
export const SCENE_BOUNDS = { minX: -12, maxX: 12, minZ: -18, maxZ: 20 } as const;

/** 三大分区（z 范围） */
export const SECTIONS = {
  backyard:  { zMin: -18, zMax: -2 },  // 后院·老宅
  corridor:  { zMin: -2,  zMax: 6 },   // 廊亭·旧门
  frontyard: { zMin: 6,   zMax: 20 },  // 前院·新房
} as const;

/** 新大门位置（南墙正中） */
export const GATE_POS: readonly [number, number] = [0, 18];

/** 地面可用行走区域（比场地略收，避免贴墙穿模） */
export const WALK_BOUNDS = { minX: -11, maxX: 11, minZ: -17, maxZ: 17 } as const;