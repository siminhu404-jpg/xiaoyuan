import { LANDMARKS, PARTITION, STRUCTURES } from './layout';
import { useLoadedAssetZones } from './assetZones';
import Architecture from './Architecture';
import ModernHouses from './ModernHouses';
import CourtyardSurfaces from './CourtyardSurfaces';
import { TerracottaCapMaterial, WallBrickMaterial } from './CourtyardMaterials';

export default function Sections() {
  const { frontyard, backyard } = useLoadedAssetZones();
  const partitionOffset = PARTITION.openingWidth / 2 + PARTITION.segmentWidth / 2;
  const gateSideOffset = PARTITION.openingWidth / 2 - PARTITION.sideWallWidth / 2;

  return (
    <group>
      <CourtyardSurfaces />
      {backyard && <Architecture />}

      {/* 内院门由 hotspot-props/CorridorProps 使用正式 GLB 资产渲染。 */}
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

      {/* 双侧葡萄架由 hotspot-props/CorridorProps 使用正式资产渲染。 */}
      {frontyard && <ModernHouses />}

      {/* 过渡区旧横墙拆成两段，中间开口与主通道对齐，不再挡住院子纵深。 */}
      <mesh position={[-partitionOffset, PARTITION.height / 2, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.segmentWidth, PARTITION.height, 0.3]} />
        <WallBrickMaterial />
      </mesh>
      <mesh position={[-partitionOffset, PARTITION.height + 0.08, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.segmentWidth + 0.12, 0.16, 0.42]} />
        <TerracottaCapMaterial />
      </mesh>
      <mesh position={[partitionOffset, PARTITION.height / 2, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.segmentWidth, PARTITION.height, 0.3]} />
        <WallBrickMaterial />
      </mesh>
      <mesh position={[partitionOffset, PARTITION.height + 0.08, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.segmentWidth + 0.12, 0.16, 0.42]} />
        <TerracottaCapMaterial />
      </mesh>

      {/* 门楼两侧加高连接墙，覆盖门柱与低矮横墙之间的视觉接缝。 */}
      <mesh position={[-gateSideOffset, PARTITION.sideWallHeight / 2, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.sideWallWidth, PARTITION.sideWallHeight, PARTITION.sideWallDepth]} />
        <WallBrickMaterial />
      </mesh>
      <mesh position={[gateSideOffset, PARTITION.sideWallHeight / 2, PARTITION.z]} castShadow>
        <boxGeometry args={[PARTITION.sideWallWidth, PARTITION.sideWallHeight, PARTITION.sideWallDepth]} />
        <WallBrickMaterial />
      </mesh>
    </group>
  );
}
