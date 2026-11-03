import { LANDMARKS, STRUCTURES } from './layout';

export default function Sections() {
  return (
    <group>
      {/* 内院·堂屋（最北侧）——结构性体块；月季/压水井已由 hotspot 组件提供 */}
      <mesh
        position={[LANDMARKS.mainRoom[0], STRUCTURES.mainRoom[1] / 2, LANDMARKS.mainRoom[1]]}
        castShadow
      >
        <boxGeometry args={[...STRUCTURES.mainRoom]} />
        <meshLambertMaterial color="#8a6f52" />
      </mesh>

      {/* 内院门：两柱一梁，位于过渡区北侧，门洞宽 ≥2.2m（柱距 3.2） */}
      <mesh position={[-1.6, 1.5, LANDMARKS.innerGate[1]]} castShadow>
        <boxGeometry args={[0.4, 3, STRUCTURES.innerGate[2]]} />
        <meshLambertMaterial color="#5a4630" />
      </mesh>
      <mesh position={[1.6, 1.5, LANDMARKS.innerGate[1]]} castShadow>
        <boxGeometry args={[0.4, 3, STRUCTURES.innerGate[2]]} />
        <meshLambertMaterial color="#5a4630" />
      </mesh>
      <mesh position={[0, 3.2, LANDMARKS.innerGate[1]]} castShadow>
        <boxGeometry args={[3.6, 0.4, STRUCTURES.innerGate[2]]} />
        <meshLambertMaterial color="#5a4630" />
      </mesh>

      {/* 双侧菜地土箱（结构性体块）；菜地作物由 hotspot 组件提供 */}
      <mesh
        position={[
          LANDMARKS.westVegetablePatch[0],
          STRUCTURES.vegetablePatch[1] / 2,
          LANDMARKS.westVegetablePatch[1],
        ]}
        castShadow
      >
        <boxGeometry args={[...STRUCTURES.vegetablePatch]} />
        <meshLambertMaterial color="#5f7a3d" />
      </mesh>
      <mesh
        position={[
          LANDMARKS.eastVegetablePatch[0],
          STRUCTURES.vegetablePatch[1] / 2,
          LANDMARKS.eastVegetablePatch[1],
        ]}
        castShadow
      >
        <boxGeometry args={[...STRUCTURES.vegetablePatch]} />
        <meshLambertMaterial color="#5f7a3d" />
      </mesh>

      {/* 双侧葡萄架：长度沿 x 轴，宽度不侵入主通道 */}
      <mesh
        position={[
          LANDMARKS.westGrapeVine[0],
          STRUCTURES.grapePergola[1] / 2,
          LANDMARKS.westGrapeVine[1],
        ]}
        castShadow
      >
        <boxGeometry args={[...STRUCTURES.grapePergola]} />
        <meshLambertMaterial color="#7a5c3e" />
      </mesh>
      <mesh
        position={[
          LANDMARKS.eastGrapeVine[0],
          STRUCTURES.grapePergola[1] / 2,
          LANDMARKS.eastGrapeVine[1],
        ]}
        castShadow
      >
        <boxGeometry args={[...STRUCTURES.grapePergola]} />
        <meshLambertMaterial color="#7a5c3e" />
      </mesh>

      {/* 外院侧房：左右各一，只形成边界，不覆盖可走区域；枣树/大门由 hotspot 组件提供 */}
      <mesh position={[-7, STRUCTURES.sideHouse[1] / 2, 13]} castShadow>
        <boxGeometry args={[...STRUCTURES.sideHouse]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>
      <mesh position={[7, STRUCTURES.sideHouse[1] / 2, 13]} castShadow>
        <boxGeometry args={[...STRUCTURES.sideHouse]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* 围墙：院落边界（结构性体块） */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[10, 2.2, 0.3]} />
        <meshLambertMaterial color="#a8998a" />
      </mesh>

      {/* 廊亭屋顶：过渡区上方的廊顶（结构性体块） */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[8, 0.3, 3]} />
        <meshLambertMaterial color="#7a5c3e" />
      </mesh>
    </group>
  );
}