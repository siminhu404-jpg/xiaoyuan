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

/** 两进院落的核心空间锚点，坐标为 [x, z]，单位为米。 */
export const LANDMARKS = {
  gate: [0, 18],
  /** 枣树移入前院开放区（原 [7,11] 压在东侧新房碰撞体上） */
  jujubeTree: [7, 8.5],
  westVegetablePatch: [-6, 5],
  eastVegetablePatch: [6, 5],
  westGrapeVine: [-6, 2],
  eastGrapeVine: [6, 2],
  innerGate: [0, -1],
  cats: [-6, 0],
  pumpWell: [6, -7],
  westRoses: [-5, -8],
  eastRoses: [5, -8],
  mainRoom: [0, -15],
} as const;

/** 结构体块使用的尺寸，格式为 x/y/z，单位为米。 */
export const STRUCTURES = {
  sideHouse: [6, 3.4, 5] as const,
  mainRoom: [10, 3.2, 4.5] as const,
  innerGate: [3.2, 3, 0.8] as const,
  grapePergola: [5.2, 2.8, 3] as const,
  vegetablePatch: [5, 0.35, 3.5] as const,
} as const;

/** 人物和小黑共用的主要行走通道。 */
export const WALK_LANES = {
  main: {
    from: [0, 17] as const,
    to: [0, -11] as const,
    width: 2.4,
  },
  east: {
    from: [1.5, 8] as const,
    to: [1.5, -10] as const,
    width: 2.2,
  },
  west: {
    from: [-1.5, 8] as const,
    to: [-1.5, -10] as const,
    width: 2.2,
  },
} as const;