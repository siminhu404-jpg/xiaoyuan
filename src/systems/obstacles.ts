import type { Obstacle } from './movement';
import { LANDMARKS } from '../scene/layout';

/** 与灰盒结构体块一一对应的圆形碰撞体（人半径 0.3 已含） */
export const OBSTACLES: readonly Obstacle[] = [
  // 堂屋南立面两侧，给中央门帘保留约 2.8m 入口。
  { x: LANDMARKS.mainRoom[0] - 3.4, z: LANDMARKS.mainRoom[1], r: 2.0 }, // 堂屋西侧
  { x: LANDMARKS.mainRoom[0] + 3.4, z: LANDMARKS.mainRoom[1], r: 2.0 }, // 堂屋东侧
  { x: LANDMARKS.westInnerHouse[0], z: LANDMARKS.westInnerHouse[1], r: 1.6 }, // 内院西房
  { x: LANDMARKS.eastInnerHouse[0], z: LANDMARKS.eastInnerHouse[1], r: 1.6 }, // 内院东房
  { x: LANDMARKS.westOuterHouse[0], z: LANDMARKS.westOuterHouse[1], r: 1.8 }, // 西新房
  { x: LANDMARKS.eastOuterHouse[0], z: LANDMARKS.eastOuterHouse[1], r: 1.8 }, // 东新房
  { x: LANDMARKS.pumpWell[0], z: LANDMARKS.pumpWell[1], r: 0.75 },      // 压水井
  { x: LANDMARKS.westRoses[0], z: LANDMARKS.westRoses[1], r: 0.7 },     // 月季西
  { x: LANDMARKS.eastRoses[0], z: LANDMARKS.eastRoses[1], r: 0.7 },     // 月季东
  { x: LANDMARKS.innerGate[0] - 1.6, z: LANDMARKS.innerGate[1], r: 0.45 }, // 内院门支撑西
  { x: LANDMARKS.innerGate[0] + 1.6, z: LANDMARKS.innerGate[1], r: 0.45 }, // 内院门支撑东
  { x: LANDMARKS.westJujubeTree[0], z: LANDMARKS.westJujubeTree[1], r: 0.85 }, // 西侧枣树
  { x: LANDMARKS.jujubeTree[0], z: LANDMARKS.jujubeTree[1], r: 0.85 },  // 东侧枣树
  // 内院生活道具：避免自由移动时穿过家具。
  { x: 0.5, z: 1.5, r: 0.8 }, // 摇椅
  { x: -5.6, z: -6.4, r: 1.0 }, // 凉床
  { x: 5.8, z: -4.05, r: 0.65 }, // 石槽
  { x: 6.5, z: -5.5, r: 0.5 }, // 水桶
  { x: 4.5, z: -5.1, r: 0.5 }, // 板凳
  // 四角廊亭按实际占地做成矩形障碍，不能从亭下穿过去。
  { x: -6, z: 2, r: 1.5, halfWidth: 2.9, halfDepth: 1.8 },
  { x: 6, z: 2, r: 1.5, halfWidth: 2.9, halfDepth: 1.8 },
  // 菜地按土箱边界扩展人物半径，覆盖整个菜畦而不是只有中心点。
  { x: -6, z: 5, r: 2.1, halfWidth: 4.5, halfDepth: 2.4 },
  { x: 6, z: 5, r: 2.1, halfWidth: 4.5, halfDepth: 2.4 },
  // 过渡区围墙两段，中间保留约 3m 主通道。
  { x: -6.9, z: 0, r: 0.45, halfWidth: 5.4, halfDepth: 0.45 },
  { x: 6.9, z: 0, r: 0.45, halfWidth: 5.4, halfDepth: 0.45 },
  { x: -1.6, z: 0, r: 0.45, halfWidth: 0.6, halfDepth: 0.7 },
  { x: 1.6, z: 0, r: 0.45, halfWidth: 0.6, halfDepth: 0.7 },
  // 南北围墙；行走边界也会二次限制人物位置。
  { x: -12, z: 1, r: 0.4, halfWidth: 0.5, halfDepth: 19.3 },
  { x: 12, z: 1, r: 0.4, halfWidth: 0.5, halfDepth: 19.3 },
  { x: 0, z: -18, r: 0.4, halfWidth: 12.3, halfDepth: 0.5 },
];

const CLOSED_GATE_OBSTACLE: Obstacle = { x: 0, z: 18, r: 2.1 };

export function getObstacles(gateOpen: boolean): readonly Obstacle[] {
  return gateOpen ? OBSTACLES : [...OBSTACLES, CLOSED_GATE_OBSTACLE];
}
