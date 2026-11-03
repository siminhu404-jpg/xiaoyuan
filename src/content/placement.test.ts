import { describe, expect, it } from 'vitest';
import hotspots from '../../content/hotspots.json';
import { LANDMARKS, WALK_BOUNDS } from '../scene/layout';

/** 东侧新房碰撞体，与 systems/obstacles.ts 中一致（x:7, z:13, r:3.4） */
const EAST_SIDE_HOUSE = { x: 7, z: 13, r: 3.4 } as const;
/** 枣树碰撞体半径，与 systems/obstacles.ts 中一致 */
const JUJUBE_R = 0.85;

const hotspotById = Object.fromEntries(
  hotspots.hotspots.map((hotspot) => [hotspot.id, hotspot]),
);

const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('hotspot graybox placement', () => {
  it('每个热点有可行走的站立点', () => {
    for (const hotspot of hotspots.hotspots) {
      const [x, z] = hotspot.standAt;
      expect(x, `${hotspot.id}.standAt.x`).toBeGreaterThanOrEqual(WALK_BOUNDS.minX);
      expect(x, `${hotspot.id}.standAt.x`).toBeLessThanOrEqual(WALK_BOUNDS.maxX);
      expect(z, `${hotspot.id}.standAt.z`).toBeGreaterThanOrEqual(WALK_BOUNDS.minZ);
      expect(z, `${hotspot.id}.standAt.z`).toBeLessThanOrEqual(WALK_BOUNDS.maxZ);
    }
  });

  it('保留外门到堂屋的空间层次', () => {
    expect(hotspotById.gate.position[1]).toBeGreaterThan(hotspotById['old-door'].position[1]);
    expect(hotspotById['old-door'].position[1]).toBeGreaterThan(hotspotById['main-room'].position[1]);
  });

  it('枣树移入前院开放区：站立点在东侧房碰撞体外，且枣树本体不压东侧房', () => {
    const tree = hotspotById['jujube-tree'];
    // 站立点必须落在东侧房圆形碰撞体之外，角色交互时才不会卡进新房体块
    const dStand = distance(tree.standAt, [EAST_SIDE_HOUSE.x, EAST_SIDE_HOUSE.z]);
    expect(dStand, 'jujube-tree.standAt 应位于东侧房碰撞体外').toBeGreaterThan(EAST_SIDE_HOUSE.r);
    // 枣树圆形碰撞体（锚在 LANDMARKS.jujubeTree，obstacles.ts 自动消费）不得与东侧房重叠
    const dTree = distance(LANDMARKS.jujubeTree, [EAST_SIDE_HOUSE.x, EAST_SIDE_HOUSE.z]);
    expect(dTree, 'JujubeTree 锚点应位于东侧房碰撞体外').toBeGreaterThan(EAST_SIDE_HOUSE.r + JUJUBE_R);
    // 树本体与角色站立点保持可及：standAt 在枣树自身碰撞体外
    expect(distance(tree.standAt, LANDMARKS.jujubeTree)).toBeGreaterThan(JUJUBE_R);
  });
});