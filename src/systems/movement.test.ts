import { describe, expect, it } from 'vitest';
import { clampToWalkArea, resolveCollision, stepToward } from './movement';
import { OBSTACLES, getObstacles } from './obstacles';

describe('clampToWalkArea', () => {
  it('范围内原样返回', () => {
    expect(clampToWalkArea(0, 0)).toEqual({ x: 0, z: 0 });
  });
  it('超界裁剪', () => {
    const r = clampToWalkArea(99, 99);
    expect(r.x).toBe(11); expect(r.z).toBe(19.5);
  });
});

describe('resolveCollision', () => {
  const obs = [{ x: 0, z: 0, r: 1 }];
  it('不在障碍内原样返回', () => {
    expect(resolveCollision(5, 5, obs)).toEqual({ x: 5, z: 5 });
  });
  it('陷入障碍被推出到半径外', () => {
    const r = resolveCollision(0.5, 0, obs);
    expect(Math.hypot(r.x, r.z)).toBeGreaterThanOrEqual(1);
  });
  it('无障碍原样返回', () => {
    expect(resolveCollision(1, 1, [])).toEqual({ x: 1, z: 1 });
  });
});

describe('stepToward', () => {
  it('未到达时按速度前进', () => {
    const r = stepToward({ x: 0, z: 0 }, { x: 2, z: 0 }, 1, 0.5);
    expect(r.x).toBeCloseTo(0.5); expect(r.reached).toBe(false);
  });
  it('一步之内标记 reached', () => {
    const r = stepToward({ x: 0, z: 0 }, { x: 0.2, z: 0 }, 1, 0.5);
    expect(r.reached).toBe(true);
  });
});

it('生活道具位置也纳入碰撞体，人物不会穿过摇椅', () => {
  const resolved = resolveCollision(0.5, 1.5, OBSTACLES);
  expect(Math.hypot(resolved.x - 0.5, resolved.z - 1.5)).toBeGreaterThanOrEqual(0.8);
});

it('葡萄架和菜地位置也会阻挡人物', () => {
  const resolved = resolveCollision(-6, 2, OBSTACLES);
  expect(Math.hypot(resolved.x + 6, resolved.z - 2)).toBeGreaterThanOrEqual(1.79);

  const vegetable = resolveCollision(6, 5, OBSTACLES);
  expect(Math.hypot(vegetable.x - 6, vegetable.z - 5)).toBeGreaterThanOrEqual(2.39);
});

it('关闭外门时，门洞本身不可穿过', () => {
  const resolved = resolveCollision(0, 18, getObstacles(false));
  expect(Math.hypot(resolved.x, resolved.z - 18)).toBeGreaterThanOrEqual(2.1);
  expect(getObstacles(true)).toHaveLength(OBSTACLES.length);
});

it('外门到堂屋的主通道不被圆形障碍连续封死', () => {
  const samples = [
    { x: 0, z: 16 },
    { x: 0, z: 10 },
    { x: 0, z: 4 },
    { x: 0, z: -4 },
    { x: 0, z: -11 },
    { x: -1.1, z: -11 },
    { x: 1.1, z: -11 },
  ];

  for (const point of samples) {
    const resolved = resolveCollision(point.x, point.z, OBSTACLES);
    expect(resolved.x, `x at z=${point.z}`).toBeCloseTo(point.x, 1);
    expect(resolved.z, `z at z=${point.z}`).toBeCloseTo(point.z, 1);
  }
});
