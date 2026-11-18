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

/** 外门门洞：两扇门绕左右门柱向两侧推开，并与南侧院墙衔接。 */
export const GATE_FRAME = {
  openingWidth: 3.6,
  pillarWidth: 0.6,
  wallHeight: 2.8,
  height: 3.4,
  depth: 0.45,
  doorHeight: 2.5,
  doorLeafWidth: 1.8,
  outerWidth: 4.8,
} as const;

export const WALK_BOUNDS = { minX: -11, maxX: 11, minZ: -17, maxZ: 19.5 } as const;

/** 两进院落的核心空间锚点，坐标为 [x, z]，单位为米。 */
export const LANDMARKS = {
  gate: [0, 18],
  westOuterHouse: [-10, 13],
  eastOuterHouse: [10, 13],
  /** 枣树移入前院开放区；东西各一棵，共用 jujube-tree 热点。 */
  westJujubeTree: [-7, 13],
  jujubeTree: [7, 13],
  westVegetablePatch: [-6, 5],
  eastVegetablePatch: [6, 5],
  westGrapeVine: [-6, 2],
  eastGrapeVine: [6, 2],
  innerGate: [0, 0],
  cats: [-4.8, 1.2],
  pumpWell: [5.6, -4.8],
  westRoses: [-2.2, -12.2],
  eastRoses: [2.2, -12.2],
  westInnerHouse: [-10, -8],
  eastInnerHouse: [10, -8],
  mainRoom: [0, -15],
} as const;

/** 外院东西两座现代房屋的门脸朝向院内，模型局部正面沿 -z。 */
export const OUTER_HOUSE_ROTATIONS = {
  west: Math.PI / 2,
  east: -Math.PI / 2,
} as const;

export const GRAPE_VINE_OFFSETS = [-1.7, 1.7] as const;

export const CAT_WANDER_BOUNDS = {
  minX: -1.2,
  maxX: 1.2,
  minZ: -0.8,
  maxZ: 0.9,
} as const;

/** 结构体块使用的尺寸，格式为 x/y/z，单位为米。 */
export const STRUCTURES = {
  sideHouse: [3.5, 3, 5] as const,
  modernHouse: [3.6, 3, 3.2] as const,
  innerSideHouse: [3, 3, 7] as const,
  mainRoom: [10, 3.4, 4.5] as const,
  innerGate: [3.6, 3.4, 0.8] as const,
  grapePergola: [5.2, 2.8, 3] as const,
  vegetablePatch: [8.4, 0.35, 4.2] as const,
  roofOverhang: 0.45,
  windowHeight: 1.1,
  windowWidth: 0.8,
  doorHeight: 2.2,
  doorWidth: 1.7,
} as const;

/** 过渡区横向围墙的灰盒开口，中心主路必须保持可见和可穿行。 */
export const PARTITION = {
  z: 0,
  height: 1.2,
  segmentWidth: 10.2,
  openingWidth: 3.6,
  sideWallWidth: 0.6,
  sideWallHeight: 1.8,
  sideWallDepth: 0.8,
} as const;

/** 灰盒验收用跟随相机参数。 */
export const GRAYBOX_CAMERA = {
  height: 4.8,
  distance: 8.5,
  fov: 52,
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