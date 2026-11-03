import type { Obstacle } from './movement';
import { LANDMARKS } from '../scene/layout';

/** 与灰盒结构体块一一对应的圆形碰撞体（人半径 0.3 已含） */
export const OBSTACLES: readonly Obstacle[] = [
  // 堂屋南立面两侧，给中央门帘保留约 2.8m 入口。
  { x: LANDMARKS.mainRoom[0] - 3.4, z: LANDMARKS.mainRoom[1], r: 2.0 }, // 堂屋西侧
  { x: LANDMARKS.mainRoom[0] + 3.4, z: LANDMARKS.mainRoom[1], r: 2.0 }, // 堂屋东侧
  { x: -7, z: 13, r: 3.4 },                                             // 西新房
  { x: 7, z: 13, r: 3.4 },                                              // 东新房
  { x: LANDMARKS.pumpWell[0], z: LANDMARKS.pumpWell[1], r: 0.75 },      // 压水井
  { x: LANDMARKS.westRoses[0], z: LANDMARKS.westRoses[1], r: 0.7 },     // 月季西
  { x: LANDMARKS.eastRoses[0], z: LANDMARKS.eastRoses[1], r: 0.7 },     // 月季东
  { x: LANDMARKS.innerGate[0] - 1.6, z: LANDMARKS.innerGate[1], r: 0.45 }, // 内院门支撑西
  { x: LANDMARKS.innerGate[0] + 1.6, z: LANDMARKS.innerGate[1], r: 0.45 }, // 内院门支撑东
  { x: LANDMARKS.jujubeTree[0], z: LANDMARKS.jujubeTree[1], r: 0.85 },  // 枣树
];
