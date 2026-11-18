import { SCENE_BOUNDS, GATE_FRAME, GATE_POS } from './layout';
import { PlasterWallMaterial } from './CourtyardMaterials';

export default function Boundary() {
  const wallH = GATE_FRAME.wallHeight;
  const openingHalf = GATE_FRAME.outerWidth / 2;
  const southSegs = [
    { cx: (SCENE_BOUNDS.minX + GATE_POS[0] - openingHalf) / 2, w: GATE_POS[0] - openingHalf - SCENE_BOUNDS.minX },
    { cx: (GATE_POS[0] + openingHalf + SCENE_BOUNDS.maxX) / 2, w: SCENE_BOUNDS.maxX - GATE_POS[0] - openingHalf },
  ];
  return (
    <group>
      {/* 北 */}
      <mesh position={[0, wallH / 2, SCENE_BOUNDS.minZ]} castShadow>
        <boxGeometry args={[24, wallH, 0.4]} />
        <PlasterWallMaterial />
      </mesh>
      {/* 东西 */}
      <mesh position={[SCENE_BOUNDS.minX, wallH / 2, 1]} castShadow>
        <boxGeometry args={[0.4, wallH, 38]} />
        <PlasterWallMaterial />
      </mesh>
      <mesh position={[SCENE_BOUNDS.maxX, wallH / 2, 1]} castShadow>
        <boxGeometry args={[0.4, wallH, 38]} />
        <PlasterWallMaterial />
      </mesh>
      {/* 南（两段，中间门洞） */}
      {southSegs.map((seg, i) => (
        <mesh key={i} position={[seg.cx, wallH / 2, GATE_POS[1]]} castShadow>
          <boxGeometry args={[seg.w, wallH, 0.4]} />
          <PlasterWallMaterial />
        </mesh>
      ))}
    </group>
  );
}