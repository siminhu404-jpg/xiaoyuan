import { describe, expect, it } from 'vitest';
import { COURTYARD_SURFACE_STYLE, getPaverToneIndex } from './CourtyardSurfaces';
import {
  CAT_WANDER_BOUNDS,
  GATE_POS,
  GATE_FRAME,
  GRAYBOX_CAMERA,
  GRAPE_VINE_OFFSETS,
  LANDMARKS,
  OUTER_HOUSE_ROTATIONS,
  PARTITION,
  SCENE_BOUNDS,
  SECTIONS,
  STRUCTURES,
  WALK_BOUNDS,
  WALK_LANES,
} from './layout';

const distance = (a: readonly [number, number], b: readonly [number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('灰盒空间布局', () => {
  it('保持从南到北的两进院落顺序', () => {
    expect(GATE_POS[1]).toBeGreaterThan(LANDMARKS.innerGate[1]);
    expect(LANDMARKS.innerGate[1]).toBeGreaterThan(LANDMARKS.mainRoom[1]);
    expect(LANDMARKS.mainRoom[1]).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
  });

  it('外门是可推开的双扇门，并与门墙形成完整门洞', () => {
    expect(GATE_FRAME.openingWidth).toBeGreaterThanOrEqual(WALK_LANES.main.width);
    expect(GATE_FRAME.pillarWidth).toBeGreaterThan(0);
    expect(GATE_FRAME.height).toBeGreaterThan(2.4);
    expect(GATE_FRAME.depth).toBeGreaterThan(0);
    expect(GATE_FRAME.outerWidth).toBe(GATE_FRAME.openingWidth + GATE_FRAME.pillarWidth * 2);
  });

  it('所有核心锚点落在场地内', () => {
    for (const [name, [x, z]] of Object.entries(LANDMARKS)) {
      expect(x, `${name}.x`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minX);
      expect(x, `${name}.x`).toBeLessThanOrEqual(SCENE_BOUNDS.maxX);
      expect(z, `${name}.z`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
      expect(z, `${name}.z`).toBeLessThanOrEqual(SCENE_BOUNDS.maxZ);
    }
  });

  it('主通道在内院门和堂屋之间保留可行走宽度', () => {
    expect(WALK_LANES.main.width).toBeGreaterThanOrEqual(2.2);
    expect(distance(WALK_LANES.main.from, WALK_LANES.main.to)).toBeGreaterThan(10);
    expect(SECTIONS.corridor.zMin).toBeLessThan(SECTIONS.corridor.zMax);
    expect(WALK_BOUNDS.minX).toBeLessThan(0);
    expect(WALK_BOUNDS.maxX).toBeGreaterThan(0);
  });

  it('内院四角门与横墙共用门洞尺寸和位置', () => {
    expect(LANDMARKS.innerGate[1]).toBe(PARTITION.z);
    expect(STRUCTURES.innerGate[0]).toBe(PARTITION.openingWidth);
  });

  it('内院门连接墙具备覆盖门柱接缝的尺寸', () => {
    expect(PARTITION.sideWallWidth).toBeGreaterThan(0);
    expect(PARTITION.sideWallHeight).toBeGreaterThanOrEqual(PARTITION.height);
    expect(PARTITION.sideWallDepth).toBeGreaterThan(0);
  });

  it('猫群位于左侧边缘而不占中央通道', () => {
    expect(LANDMARKS.cats[0]).toBeLessThan(-3);
    expect(Math.abs(LANDMARKS.cats[1] - PARTITION.z)).toBeLessThan(2);
  });

  it('横墙从院落左边界延伸到右边界，只在门楼处留门洞', () => {
    expect(PARTITION.segmentWidth).toBeCloseTo(
      (SCENE_BOUNDS.maxX - SCENE_BOUNDS.minX - PARTITION.openingWidth) / 2,
    );
  });

  it('旧横墙在主通道上保留可识别的门洞', () => {
    expect(PARTITION.openingWidth).toBeGreaterThanOrEqual(WALK_LANES.main.width);
    expect(PARTITION.height).toBeLessThan(1.8);
  });

  it('葡萄架具备廊亭高度和可识别的空间体量', () => {
    expect(STRUCTURES.grapePergola[1]).toBeGreaterThanOrEqual(2.8);
    expect(STRUCTURES.grapePergola[2]).toBeGreaterThanOrEqual(2.5);
  });

  it('葡萄架每侧由两个保持原比例的模型连续组成', () => {
    expect(STRUCTURES.grapePergola[0]).toBeLessThanOrEqual(5.5);
    expect(GRAPE_VINE_OFFSETS).toHaveLength(2);
  });

  it('葡萄架和菜畦横向铺满两侧院墙，只在中央主路留开口', () => {
    expect(STRUCTURES.vegetablePatch[0]).toBeGreaterThanOrEqual(8.4);
    expect(STRUCTURES.grapePergola[0] * 2).toBeGreaterThanOrEqual(10);
    expect(LANDMARKS.westGrapeVine[0]).toBeLessThan(-5);
    expect(LANDMARKS.eastGrapeVine[0]).toBeGreaterThan(5);
  });

  it('菜畦规模足够容纳多排混种作物', () => {
    expect(STRUCTURES.vegetablePatch[0]).toBeGreaterThanOrEqual(5.8);
    expect(STRUCTURES.vegetablePatch[2]).toBeGreaterThanOrEqual(4.2);
  });

  it('猫群游走范围限制在左侧陪伴区域', () => {
    expect(CAT_WANDER_BOUNDS.minX).toBeGreaterThanOrEqual(-1.5);
    expect(CAT_WANDER_BOUNDS.maxX).toBeLessThanOrEqual(1.5);
    expect(CAT_WANDER_BOUNDS.minZ).toBeGreaterThanOrEqual(-1);
    expect(CAT_WANDER_BOUNDS.maxZ).toBeLessThanOrEqual(1.2);
  });

  it('东西厢房沿内院两侧布置且不压迫主通道', () => {
    expect(LANDMARKS.westInnerHouse[0]).toBeLessThan(LANDMARKS.mainRoom[0]);
    expect(LANDMARKS.eastInnerHouse[0]).toBeGreaterThan(LANDMARKS.mainRoom[0]);
    expect(LANDMARKS.westInnerHouse[1]).toBeLessThan(LANDMARKS.innerGate[1]);
    expect(LANDMARKS.eastInnerHouse[1]).toBeLessThan(LANDMARKS.innerGate[1]);
    expect(LANDMARKS.westInnerHouse[1]).toBeGreaterThan(LANDMARKS.mainRoom[1]);
    expect(LANDMARKS.eastInnerHouse[1]).toBeGreaterThan(LANDMARKS.mainRoom[1]);
    expect(Math.abs(LANDMARKS.westInnerHouse[0])).toBeGreaterThanOrEqual(9);
    expect(Math.abs(LANDMARKS.eastInnerHouse[0])).toBeGreaterThanOrEqual(9);
    expect(STRUCTURES.innerSideHouse[0]).toBeLessThanOrEqual(4);
    expect(STRUCTURES.innerSideHouse[1]).toBeLessThanOrEqual(3);
    expect(STRUCTURES.innerSideHouse[2]).toBeGreaterThanOrEqual(6);
  });

  it('外院东西房的门脸朝向院内', () => {
    expect(OUTER_HOUSE_ROTATIONS.west).toBeCloseTo(Math.PI / 2);
    expect(OUTER_HOUSE_ROTATIONS.east).toBeCloseTo(-Math.PI / 2);
  });

  it('外院东西房沿南北方向展开，避免门脸朝向外门', () => {
    expect(STRUCTURES.modernHouse[0]).toBeGreaterThan(STRUCTURES.modernHouse[2]);
  });

  it('枣树位于两座外院房屋朝院子的一侧', () => {
    expect(LANDMARKS.westJujubeTree[0]).toBeGreaterThan(LANDMARKS.westOuterHouse[0]);
    expect(LANDMARKS.jujubeTree[0]).toBeLessThan(LANDMARKS.eastOuterHouse[0]);
    expect(LANDMARKS.westJujubeTree[1]).toBe(LANDMARKS.westOuterHouse[1]);
    expect(LANDMARKS.jujubeTree[1]).toBe(LANDMARKS.eastOuterHouse[1]);
  });

  it('建筑灰盒具备立面升级所需的高度和屋檐规格', () => {
    expect(STRUCTURES.sideHouse[1]).toBeGreaterThanOrEqual(3);
    expect(STRUCTURES.innerSideHouse[1]).toBeGreaterThanOrEqual(3);
    expect(STRUCTURES.mainRoom[1]).toBeGreaterThanOrEqual(3.4);
    expect(STRUCTURES.roofOverhang).toBeGreaterThan(0);
    expect(STRUCTURES.windowHeight).toBeGreaterThan(0.6);
  });

  it('外院东西房不侵入外门主视线', () => {
    expect(Math.abs(LANDMARKS.westOuterHouse[0])).toBeGreaterThanOrEqual(9);
    expect(Math.abs(LANDMARKS.eastOuterHouse[0])).toBeGreaterThanOrEqual(9);
    expect(STRUCTURES.sideHouse[0]).toBeLessThanOrEqual(4);
    expect(STRUCTURES.sideHouse[1]).toBeLessThanOrEqual(3);
  });

  it('灰盒跟随相机能同时看到人物和前方空间', () => {
    expect(GRAYBOX_CAMERA.distance).toBeGreaterThanOrEqual(6);
    expect(GRAYBOX_CAMERA.height).toBeGreaterThanOrEqual(4);
  });
});

describe('乡村庭院风格参数', () => {
  it('使用暖陶土色系和克制砖缝', () => {
    expect(COURTYARD_SURFACE_STYLE.paverTones).toEqual(
      expect.arrayContaining(['#b99478', '#c3a384', '#ad8b70']),
    );
    expect(COURTYARD_SURFACE_STYLE.grout).toBe('#a99079');
    expect(COURTYARD_SURFACE_STYLE.surfaceMode).toBe('flat-texture');
    expect(COURTYARD_SURFACE_STYLE.textureRepeat[0]).toBeGreaterThanOrEqual(5);
    expect(COURTYARD_SURFACE_STYLE.textureRepeat[1]).toBeGreaterThanOrEqual(8);
    expect(COURTYARD_SURFACE_STYLE.paverWidth).toBeGreaterThan(0.7);
  });

  it('色调分布不会按相邻砖块完全重复', () => {
    expect(getPaverToneIndex(0, 0)).not.toBe(getPaverToneIndex(0, 1));
    expect(getPaverToneIndex(1, 0)).not.toBe(getPaverToneIndex(0, 0));
  });
});
