import { describe, expect, it } from 'vitest';
import { computeMoveDir } from './keyboard';
import type { KeyState } from './keyboard';

const none: KeyState = {
  w: false, a: false, s: false, d: false,
  up: false, down: false, left: false, right: false,
};
const NORTH = { x: 0, z: -1 }; // 相机面朝北（-z，进院方向）

function keys(over: Partial<KeyState>): KeyState {
  return { ...none, ...over };
}

describe('computeMoveDir', () => {
  it('无按键 → null', () => {
    expect(computeMoveDir(none, NORTH)).toBeNull();
  });

  it('W + 北向相机 → 北', () => {
    const r = computeMoveDir(keys({ w: true }), NORTH);
    expect(r).not.toBeNull();
    expect(r!.x).toBeCloseTo(0);
    expect(r!.z).toBeCloseTo(-1);
  });

  it('S 反向 → 南', () => {
    const r = computeMoveDir(keys({ s: true }), NORTH);
    expect(r!.x).toBeCloseTo(0);
    expect(r!.z).toBeCloseTo(1);
  });

  it('A/D 横移垂直于相机朝向（右手系：D 走相机右侧）', () => {
    // 相机朝北时，右侧 = +x（东）
    const d = computeMoveDir(keys({ d: true }), NORTH);
    expect(d!.x).toBeCloseTo(1);
    expect(d!.z).toBeCloseTo(0);
    const a = computeMoveDir(keys({ a: true }), NORTH);
    expect(a!.x).toBeCloseTo(-1);
    expect(a!.z).toBeCloseTo(0);
  });

  it('W+D 对角归一化（长度 1）', () => {
    const r = computeMoveDir(keys({ w: true, d: true }), NORTH);
    expect(r).not.toBeNull();
    expect(Math.hypot(r!.x, r!.z)).toBeCloseTo(1);
    // 东北对角线，两分量相等
    expect(r!.x).toBeCloseTo(Math.SQRT1_2);
    expect(r!.z).toBeCloseTo(-Math.SQRT1_2);
  });

  it('相反键 W+S 抵消 → null', () => {
    expect(computeMoveDir(keys({ w: true, s: true }), NORTH)).toBeNull();
  });

  it('退化相机朝向 (0,0) 回退为北', () => {
    const r = computeMoveDir(keys({ w: true }), { x: 0, z: 0 });
    expect(r!.x).toBeCloseTo(0);
    expect(r!.z).toBeCloseTo(-1);
  });

  it('方向键与 WASD 同映射（Up=W, Down=S, Left=A, Right=D）', () => {
    const up = computeMoveDir(keys({ up: true }), NORTH);
    expect(up!.z).toBeCloseTo(-1);
    const right = computeMoveDir(keys({ right: true }), NORTH);
    expect(right!.x).toBeCloseTo(1);
    const left = computeMoveDir(keys({ left: true }), NORTH);
    expect(left!.x).toBeCloseTo(-1);
    const down = computeMoveDir(keys({ down: true }), NORTH);
    expect(down!.z).toBeCloseTo(1);
  });

  it('相机朝向决定方向（相机朝东时 W → 东）', () => {
    const r = computeMoveDir(keys({ w: true }), { x: 1, z: 0 });
    expect(r!.x).toBeCloseTo(1);
    expect(r!.z).toBeCloseTo(0);
  });
});