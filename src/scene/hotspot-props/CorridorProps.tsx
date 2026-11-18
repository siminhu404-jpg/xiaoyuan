import { ASSET_PATHS } from '../../content/assets';
import { useHotspotAnim } from '../../systems/useHotspotAnim';
import { LANDMARKS, PARTITION, STRUCTURES, GRAPE_VINE_OFFSETS } from '../layout';
import { ImportedAsset } from '../ImportedAsset';

const VEGETABLE_BORDER_COLORS = ['#a06b58', '#b27a63', '#96604f'];
const BORDER_BRICK_WIDTH = 0.58;
const BORDER_BRICK_HEIGHT = 0.22;
const BORDER_BRICK_DEPTH = 0.18;

function BorderBrick({ position, size, tone }: {
  position: [number, number, number];
  size: [number, number, number];
  tone: number;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshLambertMaterial color={VEGETABLE_BORDER_COLORS[tone % VEGETABLE_BORDER_COLORS.length]} />
    </mesh>
  );
}

/** 内院门正式资产：保留旧门热点的 lightFlow 记忆交互。 */
function OldDoor() {
  const ref = useHotspotAnim('old-door', 'lightFlow');
  return (
    <group position={[LANDMARKS.innerGate[0], 0, LANDMARKS.innerGate[1]]}>
      <group ref={ref} userData={{ hotspotId: 'old-door' }}>
        <ImportedAsset
          path={ASSET_PATHS.innerCourtyardGate}
          hotspotId="old-door"
          fitHeight={STRUCTURES.innerGate[1]}
          fitWidth={PARTITION.openingWidth}
          centerX
        />
      </group>
    </group>
  );
}

/** 墙头仙人掌正式资产：站在围墙顶上，保留 wobble 互动。 */
function WallCactus() {
  const ref = useHotspotAnim('wall-cactus', 'wobble');
  return (
    <group position={[-3.4, PARTITION.height, 0]}>
      <group ref={ref} userData={{ hotspotId: 'wall-cactus' }}>
        <ImportedAsset
          path={ASSET_PATHS.wallCactus}
          hotspotId="wall-cactus"
          fitHeight={1.45}
        />
      </group>
    </group>
  );
}

/** 完整葡萄架资产：东西两侧各连续摆放两个，保持原始比例。 */
function GrapeVine() {
  const ref = useHotspotAnim('grape-vine', 'shake');
  const renderVine = (baseX: number, offset: number, hotspotId?: 'grape-vine') => (
    <ImportedAsset
      path={ASSET_PATHS.grapevinePergola}
      hotspotId={hotspotId}
      fitHeight={STRUCTURES.grapePergola[1]}
      position={[baseX + offset, 0, LANDMARKS.westGrapeVine[1]]}
    />
  );

  return (
    <>
      {GRAPE_VINE_OFFSETS.map((offset) => (
        <group key={`west-grape-vine-${offset}`}>{renderVine(LANDMARKS.westGrapeVine[0], offset)}</group>
      ))}
      <group ref={ref} userData={{ hotspotId: 'grape-vine' }}>
        {GRAPE_VINE_OFFSETS.map((offset) => (
          <group key={`east-grape-vine-${offset}`}>{renderVine(LANDMARKS.eastGrapeVine[0], offset, 'grape-vine')}</group>
        ))}
      </group>
    </>
  );
}

/** 菜地：土壤、低矮边框和多排卷心菜组成完整菜畦。 */
function VegetablePatch({ x, hotspotId }: { x: number; hotspotId?: 'vegetable-patch' }) {
  const ref = useHotspotAnim('vegetable-patch', 'ripple');
  const patchWidth = STRUCTURES.vegetablePatch[0];
  const patchDepth = STRUCTURES.vegetablePatch[2];
  const plantRows = [
    { path: ASSET_PATHS.tomatoPlant, fitHeight: 0.7 },
    { path: ASSET_PATHS.pepperPlant, fitHeight: 0.65 },
    { path: ASSET_PATHS.bokChoy, fitHeight: 0.48 },
    { path: ASSET_PATHS.greenPlant, fitHeight: 0.55 },
    { path: ASSET_PATHS.cabbagePlant, fitHeight: 0.5 },
  ];
  const plants = Array.from({ length: 35 }, (_, index) => {
    const row = Math.floor(index / 7);
    const column = index % 7;
    return {
      ...plantRows[row],
      x: -patchWidth / 2 + 0.65 + column * ((patchWidth - 1.3) / 6),
      z: -patchDepth / 2 + 0.6 + row * ((patchDepth - 1.2) / 4),
    };
  });

  const content = (
    <>
      <mesh position={[0, STRUCTURES.vegetablePatch[1] + 0.07, 0]} receiveShadow>
        <boxGeometry args={[patchWidth - 0.4, 0.14, patchDepth - 0.4]} />
        <meshLambertMaterial color="#6b4931" />
      </mesh>
      {plants.map(({ path, fitHeight, x: plantX, z: plantZ }, index) => (
        <ImportedAsset
          key={`${x}-${path}-${index}`}
          path={path}
          hotspotId={hotspotId}
          fitHeight={fitHeight + (index % 3) * 0.025}
          materialStyle="plant"
          position={[plantX, 0.48, plantZ]}
          rotation={[0, (index % 2) * 0.25, 0]}
        />
      ))}
    </>
  );

  return (
    <group position={[x, 0, LANDMARKS.westVegetablePatch[1]]}>
      {hotspotId ? <group ref={ref} userData={{ hotspotId }}>{content}</group> : content}
    </group>
  );
}

function VegetableBorders({ x }: { x: number }) {
  const width = STRUCTURES.vegetablePatch[0];
  const depth = STRUCTURES.vegetablePatch[2];
  const horizontalCount = Math.ceil(width / BORDER_BRICK_WIDTH);
  const verticalCount = Math.ceil((depth - 0.36) / BORDER_BRICK_WIDTH);
  const bricks = [];

  for (let row = 0; row < 2; row += 1) {
    for (let index = 0; index < horizontalCount; index += 1) {
      const brickWidth = width / horizontalCount - 0.035;
      const brickX = -width / 2 + (index + 0.5) * (width / horizontalCount);
      bricks.push(
        <BorderBrick
          key={`north-${row}-${index}`}
          position={[brickX, BORDER_BRICK_HEIGHT / 2 + row * BORDER_BRICK_HEIGHT, -depth / 2]}
          size={[brickWidth, BORDER_BRICK_HEIGHT - 0.025, BORDER_BRICK_DEPTH]}
          tone={row + index}
        />,
        <BorderBrick
          key={`south-${row}-${index}`}
          position={[brickX, BORDER_BRICK_HEIGHT / 2 + row * BORDER_BRICK_HEIGHT, depth / 2]}
          size={[brickWidth, BORDER_BRICK_HEIGHT - 0.025, BORDER_BRICK_DEPTH]}
          tone={row + index + 1}
        />
      );
    }
    for (let index = 0; index < verticalCount; index += 1) {
      const brickDepth = (depth - 0.36) / verticalCount - 0.035;
      const brickZ = -depth / 2 + 0.18 + (index + 0.5) * ((depth - 0.36) / verticalCount);
      bricks.push(
        <BorderBrick
          key={`west-${row}-${index}`}
          position={[-width / 2, BORDER_BRICK_HEIGHT / 2 + row * BORDER_BRICK_HEIGHT, brickZ]}
          size={[BORDER_BRICK_DEPTH, BORDER_BRICK_HEIGHT - 0.025, brickDepth]}
          tone={row + index + 2}
        />,
        <BorderBrick
          key={`east-${row}-${index}`}
          position={[width / 2, BORDER_BRICK_HEIGHT / 2 + row * BORDER_BRICK_HEIGHT, brickZ]}
          size={[BORDER_BRICK_DEPTH, BORDER_BRICK_HEIGHT - 0.025, brickDepth]}
          tone={row + index}
        />
      );
    }
  }

  return (
    <group position={[x, 0, LANDMARKS.westVegetablePatch[1]]}>
      {bricks}
    </group>
  );
}

function RockingChair() {
  return (
    <group position={[0.5, 0, 1.5]} rotation={[0, 0, 0]}>
      <ImportedAsset
        path={ASSET_PATHS.rockingChair}
        hotspotId="rocking-chair"
        fitHeight={1.2}
        centerX
        materialStyle="wood"
      />
    </group>
  );
}

export default function CorridorProps() {
  return (
    <>
      <OldDoor />
      <WallCactus />
      <GrapeVine />
      <VegetableBorders x={LANDMARKS.westVegetablePatch[0]} />
      <VegetableBorders x={LANDMARKS.eastVegetablePatch[0]} />
      <VegetablePatch x={LANDMARKS.westVegetablePatch[0]} />
      <VegetablePatch x={LANDMARKS.eastVegetablePatch[0]} hotspotId="vegetable-patch" />
      <RockingChair />
    </>
  );
}