// Version only the optimized files so an older cached GLB cannot mask a release.
const ENTRY_ASSETS = new Set([
  'outer-gate-door.glb', 'outer-gate-right-door.glb', 'modern-house.glb',
  'jujube-tree.glb', 'character-with-animations.glb',
]);
export const assetPath = (fileName: string) =>
  `${import.meta.env.BASE_URL}assets/${fileName}${ENTRY_ASSETS.has(fileName) ? '?v=entry-20261120' : ''}`;

export const ASSET_PATHS = {
  jujubeTree: assetPath('jujube-tree.glb'),
  grapevinePergola: assetPath('grapevine-pergola.glb'),
  pumpWell: assetPath('pump-well.glb'),
  roseBush: assetPath('rose-bush.glb'),
  cabbagePlant: assetPath('cabbage-plant.glb'),
  innerCourtyardGate: assetPath('inner-courtyard-gate.glb'),
  outerGateDoor: assetPath('outer-gate-door.glb'),
  outerGateRightDoor: assetPath('outer-gate-right-door.glb'),
  modernHouse: assetPath('modern-house.glb'),
  mainHouse: assetPath('main-house.glb'),
  character: assetPath('character-with-animations.glb'),
  innerSideHouse: assetPath('inner-side-house.glb'),
  rockingChair: assetPath('rocking-chair.glb'),
  wallCactus: assetPath('wall-cactus.glb'),
  threeColorCat: assetPath('three-color-cat.glb'),
  blackCat: assetPath('black-cat.glb'),
  whiteCat: assetPath('white-cat.glb'),
  butterfly: assetPath('butterfly.glb'),
  borderCollie: assetPath('border-collie.glb'),
  tomatoPlant: assetPath('tomato-plant.glb'),
  pepperPlant: assetPath('pepper-plant.glb'),
  bokChoy: assetPath('bok-choy.glb'),
  greenPlant: assetPath('green-plant.glb'),
  woodenBench: assetPath('wooden-bench.glb'),
  metalBucket: assetPath('metal-bucket.glb'),
  woodenStool: assetPath('wooden-stool.glb'),
  stoneBowl: assetPath('rural-stone-trough.glb'),
} as const;
