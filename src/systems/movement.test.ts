import { describe, expect, it } from 'vitest';
import { clampToWalkArea, resolveCollision, stepToward } from './movement';

describe('clampToWalkArea', () => {
  it('范围内原样返回', () => {
    expect(clampToWalkArea(0, 0)).toEqual({ x: 0, z: 0 });
  });
  it('超界裁剪', () => {
    const r = clampToWalkArea(99, 99);
    expect(r.x).toBe(11); expect(r.z).toBe(17);
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