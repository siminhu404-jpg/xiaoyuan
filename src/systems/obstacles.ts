import type { Obstacle } from './movement';

/** 与 Task 2/6 场景体块一一对应的圆形碰撞体（人半径 0.3 已含） */
export const OBSTACLES: readonly Obstacle[] = [
  { x: -3, z: -15, r: 5.2 },   // 堂屋
  { x: -5, z: -8, r: 0.8 },    // 月季西
  { x: 5, z: -8, r: 0.8 },     // 月季东
  { x: 3, z: -11, r: 0.6 },    // 压水井
  { x: -6, z: -2, r: 0.5 },    // 廊亭西柱
  { x: 6, z: -2, r: 0.5 },     // 廊亭东柱
  { x: -7, z: 13, r: 4.0 },    // 西新房
  { x: 7, z: 13, r: 4.0 },     // 东新房
  { x: -3, z: 8, r: 0.7 },     // 枣树
];