export type HotspotId =
  | 'gate' | 'new-house-west' | 'new-house-east' | 'jujube-tree'
  | 'wall-cactus' | 'cats' | 'grape-vine' | 'vegetable-patch'
  | 'old-door' | 'pump-well' | 'main-room' | 'roses' | 'rocking-chair';

export type AnimKind =
  | 'shake' | 'wobble' | 'ripple' | 'particles' | 'liftDoor' | 'curtain'
  | 'water' | 'lightFlow' | 'catLazy' | 'catAlert' | 'catFriendly' | 'sit';

export interface MemoryContent {
  title: string;
  text: string;
  /** content/photos/ 下的文件名 */
  photo?: string;
}

export interface Hotspot {
  id: HotspotId;
  label: string;
  /** 物件在场景中的位置（x, z），y 由各物件组件自定 */
  position: readonly [number, number];
  /** 小人交互时的站立点（x, z）——走近后触发 */
  standAt: readonly [number, number];
  anim: AnimKind;
  memory?: MemoryContent;
}

export interface HotspotMap {
  hotspots: Hotspot[];
}