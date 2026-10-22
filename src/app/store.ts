import { create } from 'zustand';
import type { HotspotId } from '../content/types';

export type GamePhase = 'title' | 'intro' | 'play' | 'memory';

interface GameState {
  phase: GamePhase;
  /** 小人移动目标（null = 停止） */
  target: { x: number; z: number } | null;
  /** 正在走过去的物件（到达后触发交互） */
  pendingHotspot: HotspotId | null;
  /** 当前打开的记忆卡 */
  openHotspot: HotspotId | null;
  /** 小人位置（xyz 每帧同步给 FollowCamera 用） */
  kidPos: { x: number; z: number };

  setPhase: (p: GamePhase) => void;
  setTarget: (t: { x: number; z: number } | null) => void;
  setPendingHotspot: (id: HotspotId | null) => void;
  setOpenHotspot: (id: HotspotId | null) => void;
  setKidPos: (p: { x: number; z: number }) => void;
}

export const useGame = create<GameState>((set) => ({
  phase: 'title',
  target: null,
  pendingHotspot: null,
  openHotspot: null,
  setPhase: (phase) => set({ phase }),
  setTarget: (target) => set({ target }),
  setPendingHotspot: (pendingHotspot) => set({ pendingHotspot }),
  setOpenHotspot: (openHotspot) => set({ openHotspot }),
  kidPos: { x: 0, z: 17 },
  setKidPos: (kidPos) => set({ kidPos }),
}));