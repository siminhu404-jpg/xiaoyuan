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
  /** 性能降级旗标（DPR 已封顶 / 环境粒子减半） */
  lowPerf: boolean;

  setPhase: (p: GamePhase) => void;
  setTarget: (t: { x: number; z: number } | null) => void;
  setPendingHotspot: (id: HotspotId | null) => void;
  setOpenHotspot: (id: HotspotId | null) => void;
  setKidPos: (p: { x: number; z: number }) => void;
  enableLowPerf: () => void;
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
  lowPerf: false,
  enableLowPerf: () => set({ lowPerf: true }),
}));

// ---- test instrumentation (Playwright smoke) ----
// 把 phase / kidPos 同步到 window 便于 E2E 断言；__openHotspot 做成双向桥，
// 测试可直接写它来打开/关闭记忆卡（走真实 store setter）。仅为测试而加（~200B），
// 无行为变更，MV0 阶段随主包发布可接受。
declare global {
  interface Window {
    __phase?: GamePhase;
    __kidPos?: { x: number; z: number };
    __openHotspot?: HotspotId | null;
  }
}
if (typeof window !== 'undefined') {
  useGame.subscribe((s) => {
    window.__phase = s.phase;
    window.__kidPos = s.kidPos;
  });
  // 双向桥：读 = 当前 store 值，写 = 调用真实 setOpenHotspot
  Object.defineProperty(window, '__openHotspot', {
    configurable: true,
    enumerable: true,
    get() {
      return useGame.getState().openHotspot;
    },
    set(v: HotspotId | null) {
      useGame.getState().setOpenHotspot(v);
    },
  });
}