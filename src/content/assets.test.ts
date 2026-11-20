import { describe, expect, it } from 'vitest';
import { ASSET_PATHS } from './assets';

describe('正式资产清单', () => {
  it('为首批灰盒替换资产提供稳定的 public 路径', () => {
    expect(ASSET_PATHS.jujubeTree).toBe('/assets/jujube-tree.glb?v=walk-20261120');
    expect(ASSET_PATHS.grapevinePergola).toBe('/assets/grapevine-pergola.glb?v=walk-20261120');
    expect(ASSET_PATHS.pumpWell).toBe('/assets/pump-well.glb?v=walk-20261120');
    expect(ASSET_PATHS.roseBush).toBe('/assets/rose-bush.glb?v=walk-20261120');
    expect(ASSET_PATHS.cabbagePlant).toBe('/assets/cabbage-plant.glb?v=walk-20261120');
    expect(ASSET_PATHS.innerCourtyardGate).toBe('/assets/inner-courtyard-gate.glb?v=walk-20261120');
    expect(ASSET_PATHS.outerGateDoor).toBe('/assets/outer-gate-door.glb?v=walk-20261120');
    expect(ASSET_PATHS.outerGateRightDoor).toBe('/assets/outer-gate-right-door.glb?v=walk-20261120');
    expect(ASSET_PATHS.modernHouse).toBe('/assets/modern-house.glb?v=walk-20261120');
    expect(ASSET_PATHS.mainHouse).toBe('/assets/main-house.glb?v=walk-20261120');
    expect(ASSET_PATHS.innerSideHouse).toBe('/assets/inner-side-house.glb?v=walk-20261120');
    expect(ASSET_PATHS.rockingChair).toBe('/assets/rocking-chair.glb?v=walk-20261120');
    expect(ASSET_PATHS.wallCactus).toBe('/assets/wall-cactus.glb?v=walk-20261120');
    expect(ASSET_PATHS.threeColorCat).toBe('/assets/three-color-cat.glb?v=walk-20261120');
    expect(ASSET_PATHS.blackCat).toBe('/assets/black-cat.glb?v=walk-20261120');
    expect(ASSET_PATHS.whiteCat).toBe('/assets/white-cat.glb?v=walk-20261120');
    expect(ASSET_PATHS.butterfly).toBe('/assets/butterfly.glb');
    expect(ASSET_PATHS.borderCollie).toBe('/assets/border-collie.glb');
    expect(ASSET_PATHS.tomatoPlant).toBe('/assets/tomato-plant.glb?v=walk-20261120');
    expect(ASSET_PATHS.pepperPlant).toBe('/assets/pepper-plant.glb?v=walk-20261120');
    expect(ASSET_PATHS.bokChoy).toBe('/assets/bok-choy.glb?v=walk-20261120');
    expect(ASSET_PATHS.greenPlant).toBe('/assets/green-plant.glb?v=walk-20261120');
    expect(ASSET_PATHS.stoneBowl).toBe('/assets/rural-stone-trough.glb?v=walk-20261120');
  });
});
