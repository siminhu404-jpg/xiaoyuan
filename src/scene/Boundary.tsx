import { SCENE_BOUNDS, GATE_POS } from './layout';

export default function Boundary() {
  const wallH = 2.2;
  const southSegs = [ // 门洞宽 2m，两侧墙段
    { cx: (SCENE_BOUNDS.minX + GATE_POS[0] - 1) / 2, w: GATE_POS[0] - 1 - SCENE_BOUNDS.minX },
    { cx: (GATE_POS[0] + 1 + SCENE_BOUNDS.maxX) / 2, w: SCENE_BOUNDS.maxX - GATE_POS[0] - 1 },
  ];
  return (
    <group>
      {/* 北 */}
      <mesh position={[0, wallH / 2, SCENE_BOUNDS.minZ]} castShadow>
        <boxGeometry args={[24, wallH, 0.4]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>
      {/* 东西 */}
      <mesh position={[SCENE_BOUNDS.minX, wallH / 2, 1]} castShadow>
        <boxGeometry args={[0.4, wallH, 38]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>
      <mesh position={[SCENE_BOUNDS.maxX, wallH / 2, 1]} castShadow>
        <boxGeometry args={[0.4, wallH, 38]} />
        <meshLambertMaterial color="#9c8a6e" />
      </mesh>
      {/* 南（两段，中间门洞） */}
      {southSegs.map((seg, i) => (
        <mesh key={i} position={[seg.cx, wallH / 2, SCENE_BOUNDS.maxZ]} castShadow>
          <boxGeometry args={[seg.w, wallH, 0.4]} />
          <meshLambertMaterial color="#9c8a6e" />
        </mesh>
      ))}
    </group>
  );
}