# 《姥姥家的小院》MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use likecode:subagent-driven-development (recommended) or likecode:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 React Three Fiber 构建可在手机微信浏览器运行的 3D 交互小院——点击寻路的小人、12 个可点物件（动效+老照片+回忆文字记忆卡）、开场小电影、氛围动效。

**Architecture:** 内容与代码彻底分离（`content/hotspots.json` 定义物件/照片/文字，家人可自行编辑）；3D 场景先用占位几何体搭出全部系统，Tripo 产出的模型按 `docs/ASSETS.md` 流程后续替换；移动优先（DPR 封顶、低性能自动降级、pointer 事件天然兼容触屏）。

**Tech Stack:** Vite 5 + React 18.3 + TypeScript 5 (strict) + @react-three/fiber 8 + @react-three/drei 9 + three 0.169 + zustand 4 + Vitest 2 + Playwright 1

**设计文档:** `docs/plans/2026-10-21-xiaoyuan-design.md`（布局、物件清单、交互细节的唯一事实来源）

## Global Constraints

- **版本红线**: React 18.3.1（禁 React 19）；@react-three/fiber ^8（v9 需 React 19，禁用）；three ^0.169；@react-three/drei ^9；zustand ^4
- **坐标系统**: x 轴东西（东为 +x）；z 轴南北（**北为 -z，南为 +z**）；场景范围 x ∈ [-12, 12]，z ∈ [-18, 20]；新大门在南侧 (0, 18)
- **三大分区**: 后院 z ∈ [-18, -2]（老宅砖瓦房+堂屋+压水井+月季）；廊亭 z ∈ [-2, 6]（旧门+围墙+仙人掌+猫+葡萄藤+菜地）；前院 z ∈ [6, 18]（新房×2+枣树+新大门）
- **性能预算**: 首次加载 ≤ 15MB；中端手机 60fps；draw calls < 80；DPR 封顶 2，低性能自动降到 1
- **微信兼容**: 只用 WebGL（禁 WebGPU）；交互只用 pointer 事件；不依赖需特殊权限的 API
- **内容分离**: 物件内容只存于 `content/`；`hotspots.json` 里的回忆文字全部是**草稿**，最终必须由用户本人改写（见 `content/MEMORIES-README.md`）
- **文案语言**: UI 与内容全部简体中文
- **照片规格**: WebP、单张 ≤ 200KB、长边 ≤ 1600px，放 `content/photos/`
- **构建**: `npm run build` 产出纯静态 dist/，可托管任意静态服务器
- **提交规范**: 每任务至少一次 commit（feat:/test:/docs:/chore:），结尾加 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- **验证基准**: 纯逻辑任务走 TDD（先写失败测试）；视觉任务 `npm run dev` 人工确认后 commit

---

### Task 1: 项目脚手架（Vite + React 18 + TS + R3F）

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`
- Create: `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

**Interfaces:**
- Consumes: 无（起点任务）
- Produces: dev server（http://localhost:5173 渲染天空色 Canvas）；命令 `npm run dev` / `npm run build` / `npm test`

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "xiaoyuan",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "three": "^0.169.0",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.114.3",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.9",
    "vitest": "^2.1.3"
  }
}
```

- [ ] **Step 2: 写 vite.config.ts / tsconfig.json / .gitignore / index.html**

`vite.config.ts`：
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { assetsInlineLimit: 8192 },
});
```

`tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

`.gitignore`：
```
node_modules
dist
*.local
.DS_Store
```

`index.html`：
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#87ceeb" />
    <title>姥姥家的小院</title>
    <style>
      html, body, #root { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      body { background: #87ceeb; font-family: system-ui, -apple-system, "PingFang SC", sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: 写 src 入口**

`src/main.tsx`：
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/App.tsx`（先渲染天空色 Canvas 占位）：
```tsx
import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 6, 24], fov: 50 }}
      style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
    >
      <color attach="background" args={['#87ceeb']} />
      <ambientLight intensity={0.8} />
    </Canvas>
  );
}
```

`src/vite-env.d.ts`：
```ts
/// <reference types="vite/client" />
```

- [ ] **Step 4: 安装并验证**

```bash
npm install
npm run build   # 期望: tsc 无错误, dist/ 生成
npm run dev     # 期望: localhost:5173 显示天空色画布
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: Vite+React18+R3F 脚手架"
```

---

### Task 2: 场景骨架（地面/三区/院墙/午后光照）

**Files:**
- Create: `src/scene/Ground.tsx`, `src/scene/Boundary.tsx`, `src/scene/Lighting.tsx`, `src/scene/Sections.tsx`, `src/scene/layout.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Task 1 的 Canvas
- Produces: `src/scene/layout.ts` 导出常量 `SCENE_BOUNDS = { minX: -12, maxX: 12, minZ: -18, maxZ: 20 }`、`SECTIONS = { backyard: { zMin: -18, zMax: -2 }, corridor: { zMin: -2, zMax: 6 }, frontyard: { zMin: 6, zMax: 20 } }`、`GATE_POS: [number, number] = [0, 18]`（后续任务的地图坐标系全部以此为准）

- [ ] **Step 1: 写 layout.ts（坐标唯一事实来源）**

`src/scene/layout.ts`：
```ts
/** 场地边界（米）。x: 东西（东+），z: 南北（北-，南+） */
export const SCENE_BOUNDS = { minX: -12, maxX: 12, minZ: -18, maxZ: 20 } as const;

/** 三大分区（z 范围） */
export const SECTIONS = {
  backyard:  { zMin: -18, zMax: -2 },  // 后院·老宅
  corridor:  { zMin: -2,  zMax: 6 },   // 廊亭·旧门
  frontyard: { zMin: 6,   zMax: 20 },  // 前院·新房
} as const;

/** 新大门位置（南墙正中） */
export const GATE_POS: readonly [number, number] = [0, 18];

/** 地面可用行走区域（比场地略收，避免贴墙穿模） */
export const WALK_BOUNDS = { minX: -11, maxX: 11, minZ: -17, maxZ: 17 } as const;
```

- [ ] **Step 2: 写 Ground / Boundary / Lighting / Sections**

`src/scene/Ground.tsx`（土地色地面 + 分区色带便于调试，正式美术后续覆盖）：
```tsx
import { SECTIONS } from './layout';

export default function Ground() {
  const colors = { backyard: '#a8b57c', corridor: '#c2b280', frontyard: '#b5c99a' };
  return (
    <group>
      {(Object.keys(SECTIONS) as Array<keyof typeof SECTIONS>).map((key) => {
        const s = SECTIONS[key];
        const zCenter = (s.zMin + s.zMax) / 2;
        const depth = s.zMax - s.zMin;
        return (
          <mesh key={key} rotation-x={-Math.PI / 2} position={[0, 0, zCenter]} receiveShadow>
            <planeGeometry args={[24, depth]} />
            <meshLambertMaterial color={colors[key]} />
          </mesh>
        );
      })}
    </group>
  );
}
```

`src/scene/Boundary.tsx`（四周低矮院墙，南侧留门洞）：
```tsx
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
```

`src/scene/Lighting.tsx`（夏天午后：暖平行光+环境光+半球光，阴影先关——移动端用假阴影）：
```tsx
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#bfd9ff', '#7a8450', 0.6]} />
      <directionalLight position={[8, 14, 10]} intensity={1.2} color="#ffe8c0" />
    </>
  );
}
```

`src/scene/Sections.tsx`（各区占位体块：房屋/门，后续任务逐个替换为 hotspot）：
```tsx
export default function Sections() {
  return (
    <group>
      {/* 后院：堂屋（北墙前）+ 月季×2 + 压水井占位 */}
      <mesh position={[-3, 1.5, -15]} castShadow>
        <boxGeometry args={[10, 3, 5]} />
        <meshLambertMaterial color="#8a6f52" />
      </mesh>
      <mesh position={[-5, 0.4, -8]} castShadow><boxGeometry args={[0.8, 0.8, 0.8]} /><meshLambertMaterial color="#6b8e23" /></mesh>
      <mesh position={[5, 0.4, -8]} castShadow><boxGeometry args={[0.8, 0.8, 0.8]} /><meshLambertMaterial color="#6b8e23" /></mesh>
      <mesh position={[3, 0.6, -11]} castShadow><cylinderGeometry args={[0.4, 0.4, 1.2, 12]} /><meshLambertMaterial color="#5a5a5a" /></mesh>

      {/* 廊亭：旧门（两柱一梁）+ 围墙 + 葡萄藤架 + 菜地 */}
      <mesh position={[-6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 3.1, -2]} castShadow><boxGeometry args={[12.4, 0.4, 1.2]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[10, 2.2, 0.3]} /><meshLambertMaterial color="#a8998a" /></mesh>
      <mesh position={[0, 2.2, 0]} castShadow><boxGeometry args={[8, 0.3, 3]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
      <mesh position={[6, 0.25, 2]} rotation-y={Math.PI / 2} castShadow><boxGeometry args={[3, 0.5, 1.6]} /><meshLambertMaterial color="#5f7a3d" /></mesh>

      {/* 前院：新房×2 + 枣树占位 */}
      <mesh position={[-7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
      <mesh position={[7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
      <mesh position={[-3, 1.5, 8]} castShadow><cylinderGeometry args={[0.3, 0.4, 3, 8]} /><meshLambertMaterial color="#6b4f2f" /></mesh>
      <mesh position={[-3, 3.4, 8]} castShadow><sphereGeometry args={[1.6, 12, 10]} /><meshLambertMaterial color="#4a7a2e" /></mesh>

      {/* 新大门（门洞处两扇门板，先静态） */}
      <mesh position={[-0.5, 1, 18]} castShadow><boxGeometry args={[1, 2, 0.12]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
      <mesh position={[0.5, 1, 18]} castShadow><boxGeometry args={[1, 2, 0.12]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
    </group>
  );
}
```

- [ ] **Step 3: 接入 App.tsx**

`src/App.tsx` 整体替换为：
```tsx
import { Canvas } from '@react-three/fiber';
import Ground from './scene/Ground';
import Boundary from './scene/Boundary';
import Lighting from './scene/Lighting';
import Sections from './scene/Sections';

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 8, 26], fov: 50 }}
      style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
    >
      <color attach="background" args={['#87ceeb']} />
      <Lighting />
      <Ground />
      <Boundary />
      <Sections />
    </Canvas>
  );
}
```

- [ ] **Step 4: 人工验证**

`npm run dev` → 期望：俯视视角看到三个色带分区、院墙、房屋体块、南侧门洞。拖动可旋转视角（R3F 默认无 OrbitControls，可用相机初始位直接看）。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 场景骨架——地面/三区/院墙/午后光照/建筑占位体块"
```

---

### Task 3: 内容系统（hotspots.json + 校验脚本 + 记忆文字模板）

**Files:**
- Create: `content/hotspots.json`, `content/photos/.gitkeep`, `content/MEMORIES-README.md`, `src/content/types.ts`, `src/content/load.ts`
- Test: `src/content/load.test.ts`
- Create: `scripts/validate-content.mjs`

**Interfaces:**
- Consumes: Task 2 的 `SECTIONS`（仅文档引用，不直接 import）
- Produces:
  - `src/content/types.ts`: `HotspotId`（12 个字面量联合）、`interface Hotspot { id: HotspotId; label: string; position: readonly [number, number]; standAt: readonly [number, number]; anim: 'shake'|'wobble'|'ripple'|'particles'|'liftDoor'|'curtain'|'water'|'lightFlow'|'catLazy'|'catAlert'|'catFriendly'; memory?: { title: string; text: string; photo?: string } }`、`interface HotspotMap { hotspots: Hotspot[] }`
  - `src/content/load.ts`: `export function getHotspotMap(json: unknown): HotspotMap`（带完整运行时校验，非法数据抛出带物件 id 的错误）

- [ ] **Step 1: 写 src/content/types.ts**

```ts
export type HotspotId =
  | 'gate' | 'new-house-west' | 'new-house-east' | 'jujube-tree'
  | 'wall-cactus' | 'cats' | 'grape-vine' | 'vegetable-patch'
  | 'old-door' | 'pump-well' | 'main-room' | 'roses';

export type AnimKind =
  | 'shake' | 'wobble' | 'ripple' | 'particles' | 'liftDoor' | 'curtain'
  | 'water' | 'lightFlow' | 'catLazy' | 'catAlert' | 'catFriendly';

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
```

- [ ] **Step 2: 写失败测试 src/content/load.test.ts**

```ts
import { describe, expect, it } from 'vitest';
import { getHotspotMap } from './load';

const validHotspot = {
  id: 'gate', label: '新大门',
  position: [0, 18] as const, standAt: [0, 16.5] as const,
  anim: 'liftDoor',
  memory: { title: '回家', text: '每次回来...', photo: 'gate-2020.webp' },
};

describe('getHotspotMap', () => {
  it('接受合法数据', () => {
    const m = getHotspotMap({ hotspots: [validHotspot] });
    expect(m.hotspots).toHaveLength(1);
    expect(m.hotspots[0].label).toBe('新大门');
  });
  it('photo 可省略', () => {
    const { memory, ...noPhoto } = validHotspot;
    const m = getHotspotMap({ hotspots: [{ ...noPhoto, memory: { title: 't', text: 'x' } }] });
    expect(m.hotspots[0].memory?.photo).toBeUndefined();
  });
  it('拒绝未知 id', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, id: 'moon' as never }] })).toThrow(/id/);
  });
  it('拒绝未知 anim', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, anim: 'spin' as never }] })).toThrow(/anim/);
  });
  it('拒绝缺失 label', () => {
    const { label, ...noLabel } = validHotspot;
    expect(() => getHotspotMap({ hotspots: [noLabel] })).toThrow(/label/);
  });
  it('拒绝重复 id', () => {
    expect(() => getHotspotMap({ hotspots: [validHotspot, validHotspot] })).toThrow(/gate/);
  });
});
```

- [ ] **Step 3: 运行确认失败**

```bash
npm test
```
期望：`getHotspotMap` 相关用例 FAIL（模块不存在）。

- [ ] **Step 4: 写 src/content/load.ts**

```ts
import type { AnimKind, HotspotId, Hotspot, HotspotMap } from './types';

const IDS: readonly HotspotId[] = [
  'gate', 'new-house-west', 'new-house-east', 'jujube-tree',
  'wall-cactus', 'cats', 'grape-vine', 'vegetable-patch',
  'old-door', 'pump-well', 'main-room', 'roses',
];
const ANIMS: readonly AnimKind[] = [
  'shake', 'wobble', 'ripple', 'particles', 'liftDoor', 'curtain',
  'water', 'lightFlow', 'catLazy', 'catAlert', 'catFriendly',
];

function fail(msg: string): never {
  throw new Error(`[content] ${msg}`);
}

export function getHotspotMap(json: unknown): HotspotMap {
  if (typeof json !== 'object' || json === null || !Array.isArray((json as HotspotMap).hotspots)) {
    fail('根对象必须含 hotspots 数组');
  }
  const seen = new Set<string>();
  const out: Hotspot[] = [];
  for (const raw of (json as HotspotMap).hotspots) {
    const h = raw as Record<string, unknown>;
    if (!IDS.includes(h.id as HotspotId)) fail(`未知物件 id: ${String(h.id)}`);
    if (typeof h.label !== 'string' || !h.label) fail(`[${h.id}] label 必须是非空字符串`);
    const pos = h.position, stand = h.standAt;
    if (!Array.isArray(pos) || pos.length !== 2 || pos.some((v) => typeof v !== 'number')) fail(`[${h.id}] position 必须是 [x, z] 数字对`);
    if (!Array.isArray(stand) || stand.length !== 2 || stand.some((v) => typeof v !== 'number')) fail(`[${h.id}] standAt 必须是 [x, z] 数字对`);
    if (!ANIMS.includes(h.anim as AnimKind)) fail(`[${h.id}] 未知动效类型: ${String(h.anim)}`);
    if (seen.has(h.id as string)) fail(`[${h.id}] id 重复`);
    seen.add(h.id as string);
    let memory: Hotspot['memory'];
    if (h.memory !== undefined) {
      const m = h.memory as Record<string, unknown>;
      if (typeof m.title !== 'string' || !m.title) fail(`[${h.id}] memory.title 必须是非空字符串`);
      if (typeof m.text !== 'string' || !m.text) fail(`[${h.id}] memory.text 必须是非空字符串`);
      if (m.photo !== undefined && typeof m.photo !== 'string') fail(`[${h.id}] memory.photo 必须是字符串`);
      memory = { title: m.title, text: m.text, photo: m.photo as string | undefined };
    }
    out.push({
      id: h.id as HotspotId, label: h.label as string,
      position: pos as unknown as Hotspot['position'],
      standAt: stand as unknown as Hotspot['standAt'],
      anim: h.anim as AnimKind, memory,
    });
  }
  return { hotspots: out };
}
```

- [ ] **Step 5: 运行测试通过**

```bash
npm test
```
期望：全部 PASS。

- [ ] **Step 6: 写 content/hotspots.json（12 物件，坐标按 Task 2 场景骨架）**

```jsonc
{
  "hotspots": [
    { "id": "gate", "label": "新大门", "position": [0, 18], "standAt": [0, 16.5], "anim": "liftDoor",
      "memory": { "title": "回家", "text": "（草稿）进了这扇门，就是姥姥家的地界了。", "photo": "gate-family.webp" } },
    { "id": "new-house-west", "label": "西边新房", "position": [-7, 13], "standAt": [-7, 10.5], "anim": "curtain",
      "memory": { "title": "盖新房那年", "text": "（草稿）...", "photo": "newhouse-build.webp" } },
    { "id": "new-house-east", "label": "东边新房", "position": [7, 13], "standAt": [7, 10.5], "anim": "curtain",
      "memory": { "title": "东屋", "text": "（草稿）..." } },
    { "id": "jujube-tree", "label": "枣树", "position": [-3, 8], "standAt": [-3, 6.5], "anim": "shake",
      "memory": { "title": "那棵枣树", "text": "（草稿）每年秋天打枣...", "photo": "tree-harvest.webp" } },
    { "id": "wall-cactus", "label": "墙头仙人掌", "position": [0, 0.2], "standAt": [0, 2.5], "anim": "wobble",
      "memory": { "title": "墙上的仙人掌", "text": "（草稿）..." } },
    { "id": "cats", "label": "猫猫们", "position": [-6, 1.5], "standAt": [-6, 3.5], "anim": "catFriendly",
      "memory": { "title": "院里的猫", "text": "（草稿）...", "photo": "cats-2021.webp" } },
    { "id": "grape-vine", "label": "葡萄藤", "position": [8.8, 0], "standAt": [7.5, 2.5], "anim": "shake",
      "memory": { "title": "葡萄熟了", "text": "（草稿）...", "photo": "grape-pick.webp" } },
    { "id": "vegetable-patch", "label": "菜地", "position": [6, 2], "standAt": [6, 4.2], "anim": "ripple",
      "memory": { "title": "姥姥的菜地", "text": "（草稿）...", "photo": "garden-work.webp" } },
    { "id": "old-door", "label": "老院门", "position": [0, -2], "standAt": [0, 0.5], "anim": "lightFlow",
      "memory": { "title": "这里原来是院门", "text": "（草稿）这扇门以前是院子的大门。那时候院子还没扩这么大...", "photo": "olddoor-1990s.webp" } },
    { "id": "pump-well", "label": "压水井", "position": [3, -11], "standAt": [3, -9.5], "anim": "water",
      "memory": { "title": "压水", "text": "（草稿）..." } },
    { "id": "main-room", "label": "堂屋", "position": [-3, -15], "standAt": [-3, -12.2], "anim": "curtain",
      "memory": { "title": "堂屋", "text": "（草稿）...", "photo": "mainroom-inside.webp" } },
    { "id": "roses", "label": "月季", "position": [5, -8], "standAt": [5, -6.5], "anim": "wobble",
      "memory": { "title": "月季", "text": "（草稿）...", "photo": "roses-bloom.webp" } }
  ]
}
```
注意：JSON 不支持注释，落盘时去掉 `c` 后缀并确保纯 JSON。坐标与 Task 2 占位体块一一对应；`grape-vine` 的 x 取 8.8（藤架东侧靠墙）。

- [ ] **Step 7: 写 content/MEMORIES-README.md（给家人的说明书）**

```markdown
# 怎么改这个院子里的回忆文字

1. 打开 `content/hotspots.json`，找到想改的物件（比如 "那棵枣树"）
2. 改 `memory.text` —— 把「（草稿）」换成你真正想说的话
3. `memory.photo` 填 `content/photos/` 里的照片文件名，不想要照片就删掉 photo 那行
4. 改完不用碰任何代码，重新发布即可

**所有标注（草稿）的文字都是 AI 起的占位稿，必须换成自己写的。**
照片要求：WebP 格式、每张小于 200KB、长边不超过 1600px。
```

- [ ] **Step 8: 写 scripts/validate-content.mjs（CI 校验：json 合法 + 照片存在）**

```js
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.parse(readFileSync(join(root, 'content/hotspots.json'), 'utf8'));
const photos = new Set(readdirSync(join(root, 'content/photos')).filter((f) => f !== '.gitkeep'));

let errors = 0;
for (const h of json.hotspots) {
  if (h.memory?.photo && !photos.has(h.memory.photo)) {
    console.error(`✗ [${h.id}] 引用的照片不存在: content/photos/${h.memory.photo}`);
    errors++;
  }
  if (!h.memory) console.warn(`△ [${h.id}] 没有记忆卡内容`);
  if (h.memory?.text?.includes('草稿')) console.warn(`△ [${h.id}] 记忆文字还是草稿`);
}
if (errors) { console.error(`\n${errors} 个错误`); process.exit(1); }
console.log(`✓ ${json.hotspots.length} 个物件校验通过（警告不阻断）`);
```

package.json 的 scripts 加一行：`"validate": "node scripts/validate-content.mjs"`。

- [ ] **Step 9: 运行校验（此时应报缺照片警告但不失败）+ 测试 + Commit**

```bash
npm run validate   # 期望: ✗ 若干（照片不存在）→ 因照片错误退出码 1 是允许的当前状态；先创建空 photos 目录后照片引用先全部删掉 photo 字段亦可
```
简化处理：**Step 6 的 json 先不放 photo 字段**（等用户照片就位后再加），校验脚本对 photo 不存在只报 warning 时不退出 —— 即把 `errors++; process.exit(1)` 分支仅保留给「json 本身非法」。最终规则：**photo 文件缺失 = error 退出**，但 Step 6 落盘的 json 此时不写 photo 字段。
```bash
npm test           # 全 PASS
git add -A
git commit -m "feat: 内容系统——hotspots 数据模型/运行时校验/记忆文字模板/CI 校验脚本"
```

---

### Task 4: 点击寻路系统（ClickToMove + 圆形碰撞 + 行走区裁剪）

**Files:**
- Create: `src/systems/movement.ts`, `src/systems/ClickToMove.tsx`
- Test: `src/systems/movement.test.ts`

**Interfaces:**
- Consumes: `WALK_BOUNDS`（Task 2）、Canvas 的 `raycaster`
- Produces:
  - `src/systems/movement.ts`: `export interface Obstacle { x: number; z: number; r: number }`、`export function clampToWalkArea(x: number, z: number): { x: number; z: number }`、`export function resolveCollision(x: number, z: number, obstacles: readonly Obstacle[]): { x: number; z: number }`、`export function stepToward(from: { x: number; z: number }, to: { x: number; z: number }, speed: number, dt: number): { x: number; z: number; reached: boolean }`
  - `src/systems/ClickToMove.tsx`: R3F 组件 `<ClickToMove groundName="ground" onArrive={(id) => ...} />` —— 点击场景，命中地面则设置 store 目标点；供 Task 7 的小人组件消费

- [ ] **Step 1: 写失败测试 src/systems/movement.test.ts**

```ts
import { describe, expect, it } from 'vitest';
import { clampToWalkArea, resolveCollision, stepToward } from './movement';

describe('clampToWalkArea', () => {
  it('范围内原样返回', () => {
    expect(clampToWalkArea(0, 0)).toEqual({ x: 0, z: 0 });
  });
  it('超界裁剪', () => {
    const r = clampToWalkArea(99, 99);
    expect(r.x).toBe(11); expect(r.z).toBe(17);
  });
});

describe('resolveCollision', () => {
  const obs = [{ x: 0, z: 0, r: 1 }];
  it('不在障碍内原样返回', () => {
    expect(resolveCollision(5, 5, obs)).toEqual({ x: 5, z: 5 });
  });
  it('陷入障碍被推出到半径外', () => {
    const r = resolveCollision(0.5, 0, obs);
    expect(Math.hypot(r.x, r.z)).toBeGreaterThanOrEqual(1);
  });
  it('无障碍原样返回', () => {
    expect(resolveCollision(1, 1, [])).toEqual({ x: 1, z: 1 });
  });
});

describe('stepToward', () => {
  it('未到达时按速度前进', () => {
    const r = stepToward({ x: 0, z: 0 }, { x: 2, z: 0 }, 1, 0.5);
    expect(r.x).toBeCloseTo(0.5); expect(r.reached).toBe(false);
  });
  it('一步之内标记 reached', () => {
    const r = stepToward({ x: 0, z: 0 }, { x: 0.2, z: 0 }, 1, 0.5);
    expect(r.reached).toBe(true);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
npm test
```
期望：movement 相关 FAIL（模块不存在）。

- [ ] **Step 3: 写 src/systems/movement.ts**

```ts
import { WALK_BOUNDS } from '../scene/layout';

export interface Obstacle { x: number; z: number; r: number }

const EPS = 1e-4;

export function clampToWalkArea(x: number, z: number): { x: number; z: number } {
  return {
    x: Math.min(WALK_BOUNDS.maxX, Math.max(WALK_BOUNDS.minX, x)),
    z: Math.min(WALK_BOUNDS.maxZ, Math.max(WALK_BOUNDS.minZ, z)),
  };
}

export function resolveCollision(x: number, z: number, obstacles: readonly Obstacle[]): { x: number; z: number } {
  let px = x, pz = z;
  for (const o of obstacles) {
    const dx = px - o.x, dz = pz - o.z;
    const dist = Math.hypot(dx, dz);
    if (dist < o.r) {
      if (dist < EPS) { px = o.x + o.r; continue; } // 正中心：往东推
      px = o.x + (dx / dist) * o.r;
      pz = o.z + (dz / dist) * o.r;
    }
  }
  return clampToWalkArea(px, pz);
}

/** 每帧推进；目标距离小于一步时贴齐并标记 reached */
export function stepToward(
  from: { x: number; z: number }, to: { x: number; z: number },
  speed: number, dt: number,
): { x: number; z: number; reached: boolean } {
  const dx = to.x - from.x, dz = to.z - from.z;
  const dist = Math.hypot(dx, dz);
  const step = speed * dt;
  if (dist <= step || dist < EPS) return { x: to.x, z: to.z, reached: true };
  return { x: from.x + (dx / dist) * step, z: from.z + (dz / dist) * step, reached: false };
}
```

- [ ] **Step 4: 运行测试通过**

```bash
npm test
```
期望：全部 PASS。

- [ ] **Step 5: 写全局状态 store（小人目标，供多组件通信）**

创建 `src/app/store.ts`：
```ts
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

  setPhase: (p: GamePhase) => void;
  setTarget: (t: { x: number; z: number } | null) => void;
  setPendingHotspot: (id: HotspotId | null) => void;
  setOpenHotspot: (id: HotspotId | null) => void;
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
}));
```

- [ ] **Step 6: 写 ClickToMove 组件**

`src/systems/ClickToMove.tsx`（点击 = pointerdown+pointerup 距离小于阈值，避免与拖动旋转视角冲突；命中地面写入 target；命中 hotspot mesh 写 pendingHotspot + target=其 standAt）：
```tsx
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { hotspots } from '../content/data';

const DRAG_THRESHOLD_PX = 8;

export default function ClickToMove({ onGroundClick }: { onGroundClick?: (p: { x: number; z: number }) => void }) {
  const down = useMemo(() => ({ x: 0, y: 0 }), []);
  const { gl } = useThree();

  const handleDown = (e: ThreeEvent<PointerEvent>) => { down.x = e.clientX ?? 0; down.y = e.clientY ?? 0; };
  const handleUp = (e: ThreeEvent<PointerEvent>) => {
    const dx = (e.clientX ?? 0) - down.x, dy = (e.clientY ?? 0) - down.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return; // 拖动视角，不算点击
    const obj = e.intersections[0]?.object;
    if (!obj) return;
    const hid = obj.userData?.hotspotId as string | undefined;
    if (hid) {
      const h = hotspots.find((x) => x.id === hid);
      if (!h) return;
      useGame.getState().setPendingHotspot(h.id);
      useGame.getState().setTarget({ x: h.standAt[0], z: h.standAt[1] });
    } else if (obj.name === 'ground') {
      const p = e.intersections[0].point;
      useGame.getState().setPendingHotspot(null);
      useGame.getState().setTarget({ x: p.x, z: p.z });
      onGroundClick?.({ x: p.x, z: p.z });
    }
  };

  return (
    <mesh
      name="click-capture"
      visible={false}
      position={[0, 0, 0]}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
    >
      <planeGeometry args={[80, 80]} />
    </mesh>
  );
}
```
同时创建 `src/content/data.ts`（把 json 变成类型安全的运行时数据）：
```ts
import raw from '../../content/hotspots.json';
import { getHotspotMap } from './load';

export const hotspotMap = getHotspotMap(raw);
export const hotspots = hotspotMap.hotspots;
```
`tsconfig.json` 的 compilerOptions 加 `"resolveJsonModule": true`。

注意：click-capture 是一块与地面重叠的隐形捕获面（射线取最近命中，地面本身也会命中，逻辑里优先 `userData.hotspotId`，其次 `name === 'ground'`——因此 **Ground.tsx 所有地面 mesh 的 name 必须设为 "ground"**，Task 2 的 Ground 需要同步加 `name="ground"`）。App.tsx 的 Canvas 里挂 `<ClickToMove />`（onGroundClick 暂时空实现）。

- [ ] **Step 7: 人工验证 + Commit**

`npm run dev` → 点击地面不同位置，console.log 打印目标坐标（在 onGroundClick 里临时 console.log）。
```bash
git add -A
git commit -m "feat: 点击寻路系统——移动数学/碰撞/事件捕获与全局状态"
```

---

### Task 5: 小人（占位胶囊小人 + 行走/朝向 + 待机摇摆）

**Files:**
- Create: `src/systems/Kid.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useGame`（target/pendingHotspot，Task 4）、`stepToward/resolveCollision`（Task 4）、`hotspots`（Task 4 的 data.ts）
- Produces: `<Kid />` 组件——读取 store 的 target 每帧走位，抵达物件 standAt 时调用 `setOpenHotspot(pendingHotspot)`；朝向目标；无 target 时轻微呼吸摇摆。所有障碍物位置从 `src/systems/obstacles.ts` 读取（本任务创建）

- [ ] **Step 1: 写障碍物表 src/systems/obstacles.ts（与场景占位体块对应）**

```ts
import type { Obstacle } from './movement';

/** 与 Task 2/6 场景体块一一对应的圆形碰撞体（人半径 0.3 已含） */
export const OBSTACLES: readonly Obstacle[] = [
  { x: -3, z: -15, r: 5.2 },   // 堂屋
  { x: -5, z: -8, r: 0.8 },    // 月季西
  { x: 5, z: -8, r: 0.8 },     // 月季东
  { x: 3, z: -11, r: 0.6 },    // 压水井
  { x: -6, z: -2, r: 0.5 },    // 廊亭西柱
  { x: 6, z: -2, r: 0.5 },     // 廊亭东柱
  { x: -7, z: 13, r: 4.0 },    // 西新房
  { x: 7, z: 13, r: 4.0 },     // 东新房
  { x: -3, z: 8, r: 0.7 },     // 枣树
];
```

- [ ] **Step 2: 写 Kid.tsx**

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { stepToward, resolveCollision } from './movement';
import { OBSTACLES } from './obstacles';
import { hotspots } from '../content/data';

const SPEED = 1.5; // 米/秒，闲庭信步

export default function Kid() {
  const group = useRef<THREE.Group>(null!);
  const posRef = useRef({ x: 0, z: 16 });
  const yawRef = useRef(Math.PI); // 面朝南（镜头方向）
  const tRef = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05); // 切后台回来防跳变
    const g = useGame.getState();
    const t = tRef.current += dt;

    if (g.target && g.phase !== 'title') {
      const { x, z, reached } = stepToward(posRef.current, g.target, SPEED, dt);
      const solved = resolveCollision(x, z, OBSTACLES);
      posRef.current = solved;
      // 朝向移动方向
      const dx = g.target.x - solved.x, dz = g.target.z - solved.z;
      if (Math.hypot(dx, dz) > 0.05) {
        yawRef.current = Math.atan2(dx, dz);
      }
      if (reached) {
        g.setTarget(null);
        if (g.pendingHotspot) {
          const id = g.pendingHotspot;
          g.setPendingHotspot(null);
          g.setOpenHotspot(id); // 到达物件 → 打开记忆卡
        }
      }
    } else {
      // 待机：轻微呼吸摇摆
    }

    if (group.current) {
      group.current.position.set(posRef.current.x, 0, posRef.current.z);
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, yawRef.current, Math.min(1, dt * 10),
      );
      const bob = g.target ? Math.abs(Math.sin(t * 8)) * 0.06 : Math.sin(t * 2) * 0.01;
      group.current.position.y = bob;
    }
  });

  return (
    <group ref={group} position={[0, 0, 16]}>
      {/* 占位小人：胶囊身体+球头。正式模型（Tripo+Mixamo）后续替换 */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshLambertMaterial color="#e8582a" />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshLambertMaterial color="#f2c49b" />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 3: 接入 App.tsx 并人工验证**

App.tsx 的 Canvas 内加 `<Kid />`。`npm run dev` 验证：
1. 点击地面各处，小人以稳定速度走过去并停下
2. 点击堂屋（待 hotspot 化后）——本阶段先验证走位/朝向/碰撞推挤（把小人点进堂屋位置，会被推出墙外）
3. 快速连续点击，目标即时切换

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 小人——占位模型/点击走位/朝向/待机呼吸/碰撞推挤"
```

---

### Task 6: 跟随相机（平滑第三人称 + 射线防穿墙）

**Files:**
- Create: `src/systems/FollowCamera.tsx`
- Modify: `src/App.tsx`（移除 Canvas camera prop 的固定值，改为 FollowCamera 接管）

**Interfaces:**
- Consumes: Kid 的位置（通过 store 暴露——本任务在 `src/app/store.ts` 增加 `kidPos: {x: number; z: number}` 与 `setKidPos`，Kid.tsx 每帧同步；或 FollowCamera 直接读 Kid 的 ref，二选一，**采用 store 方案**，因为 UI 层后续也要用小人位置）
- Produces: `<FollowCamera />`——每帧把相机放到 `kidPos 后上方偏移 (0, 3.2, 4.6)` 的 lerp 位置，lookAt 小人；相机到小人连线被建筑遮挡时自动拉近

- [ ] **Step 1: store 增加小人位置**

`src/app/store.ts` 的 GameState 增加：
```ts
kidPos: { x: number; z: number };
setKidPos: (p: { x: number; z: number }) => void;
```
实现：
```ts
kidPos: { x: 0, z: 16 },
setKidPos: (kidPos) => set({ kidPos }),
```
⚠️ zustand 的 set 每帧调用不会引发 React 重渲染风暴吗？——`setKidPos` 只被 useFrame 调用，订阅者是 FollowCamera 内部的 `useGame.getState()`（非响应式读取），UI 层用 selector 订阅 `kidPos` 时需注意：**每帧 set 会触发所有订阅了 kidPos 的组件重渲染**。因此 Kid.tsx 同步位置用 `useGame.getState().setKidPos(...)` 且 UI 层**不得** selector 订阅 kidPos（后续 UI 需要时用节流或 event）。FollowCamera 同样用 `getState()` 读。

- [ ] **Step 2: 写 FollowCamera.tsx**

```tsx
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { OBSTACLES } from './obstacles';

const OFFSET = new THREE.Vector3(0, 3.2, 4.6); // 小人身后上方
const LERP = 2.5; // 相机跟随平滑系数

export default function FollowCamera() {
  const { camera, scene } = useThree();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const ray = new THREE.Raycaster();

  useFrame((_, dt) => {
    const { kidPos } = useGame.getState();
    desired.set(kidPos.x + OFFSET.x, OFFSET.y, kidPos.z + OFFSET.z);
    lookAt.set(kidPos.x, 1.0, kidPos.z);

    // 射线防穿墙：从小人头部到理想相机位连线，被障碍挡住则把相机拉近
    // 简化实现：相机高度固定，只检查水平方向上是否陷入建筑圆柱内，陷入则沿连线拉近到障碍半径外
    let t = 1.0;
    const head = new THREE.Vector3(kidPos.x, 1.2, kidPos.z);
    for (const o of OBSTACLES) {
      const dx = desired.x - head.x, dz = desired.z - head.z;
      const len = Math.hypot(dx, dz);
      if (len < 1e-3) continue;
      // 点到线段最近距离（水平面）
      const px = head.x - o.x, pz = head.z - o.z;
      const dot = (px * dx + pz * dz) / (len * len);
      if (dot < 0 || dot > 1) continue;
      const cx = head.x + dx * dot - o.x, cz = head.z + dz * dot - o.z;
      const dist = Math.hypot(cx, cz);
      if (dist < o.r + 0.3) {
        // 拉近：解 t 使相机在障碍外
        const back = Math.max(0.05, dot - 0.35);
        t = Math.min(t, back / 1);
      }
    }
    const finalPos = new THREE.Vector3().lerpVectors(head, desired, t);
    finalPos.y = THREE.MathUtils.lerp(camera.position.y, finalPos.y + 0.6, 1);

    camera.position.lerp(finalPos, Math.min(1, dt * LERP));
    camera.lookAt(lookAt);
  });

  return null;
}
```

- [ ] **Step 3: 接入并人工验证**

App.tsx：Canvas 的 `camera` prop 改为 `{ position: [0, 4, 21], fov: 50 }`（仅初始值），Canvas 内加 `<FollowCamera />`。

`npm run dev` 验证：
1. 小人走动，相机平滑跟随，永远看向小人
2. 把小人点到堂屋正后方绕行，相机被建筑挡住时明显拉近、不穿模
3. 快速来回点击，相机不眩晕

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 跟随相机——平滑第三人称/射线防穿墙拉近"
```

---

### Task 7: 记忆卡 UI（照片+文字卡片 + zustand 打开/关闭）

**Files:**
- Create: `src/ui/MemoryCard.tsx`
- Modify: `src/App.tsx`（Canvas 之上叠加 DOM 层）

**Interfaces:**
- Consumes: `useGame`（openHotspot）、`hotspots`（Task 4 data.ts）
- Produces: 记忆卡 DOM 组件——openHotspot 非空时从底部滑入；含关闭按钮；关闭时 `setOpenHotspot(null)`

- [ ] **Step 1: 写 MemoryCard.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useGame } from '../app/store';
import { hotspots } from '../content/data';

export default function MemoryCard() {
  const openId = useGame((s) => s.openHotspot);
  const phase = useGame((s) => s.phase);
  const setOpenHotspot = useGame((s) => s.setOpenHotspot);
  const [shown, setShown] = useState(false); // 控制滑入动画
  const hotspot = hotspots.find((h) => h.id === openId);

  useEffect(() => {
    if (openId) {
      const timer = setTimeout(() => setShown(true), 380); // 动效先行 400ms 再出卡
      return () => clearTimeout(timer);
    }
    setShown(false);
  }, [openId]);

  if (!hotspot || phase === 'title') return null;

  return (
    <div
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          width: 'min(92vw, 480px)', margin: '0 auto 24px',
          background: 'rgba(253, 250, 242, 0.96)',
          borderRadius: 18, padding: '18px 20px 20px',
          boxShadow: '0 8px 32px rgba(60, 40, 20, 0.25)',
          transform: shown ? 'translateY(0)' : 'translateY(110%)',
          opacity: shown ? 1 : 0,
          transition: 'transform 380ms cubic-bezier(.2,.8,.3,1), opacity 300ms',
          pointerEvents: 'auto',
        }}
      >
        {hotspot.memory?.photo && (
          <img
            src={`content/photos/${hotspot.memory.photo}`}
            style={{ width: '100%', borderRadius: 12, display: 'block', marginBottom: 12 }}
            alt={hotspot.memory.title}
          />
        )}
        <h2 style={{ margin: '0 0 8px', fontSize: 22, color: '#4a3728' }}>
          {hotspot.memory?.title ?? hotspot.label}
        </h2>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: '#5c4a38', whiteSpace: 'pre-wrap' }}>
          {hotspot.memory?.text ?? '（这段回忆还没写好）'}
        </p>
        <button
          onClick={() => setOpenHotspot(null)}
          style={{
            marginTop: 16, width: '100%', padding: '12px 0', fontSize: 18,
            border: 'none', borderRadius: 12, background: '#c9a06a', color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          合上回忆
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: App.tsx 加 DOM 层**

```tsx
import { Canvas } from '@react-three/fiber';
import Ground from './scene/Ground';
// ...其他 import
import MemoryCard from './ui/MemoryCard';

export default function App() {
  return (
    <>
      <Canvas ...>
        {/* 3D 内容 */}
      </Canvas>
      <MemoryCard />
    </>
  );
}
```

- [ ] **Step 3: 人工验证 + Commit**

`npm run dev`：
1. 暂时把 store 初始 `openHotspot` 设为 `'jujube-tree'` 验证样式 → 记得改回 null
2. 卡片滑入/滑出动画顺滑，字号够大，按钮好点

```bash
git add -A
git commit -m "feat: 记忆卡——照片/文字/大字号/滑入滑出"
```

---

### Task 8: 开场小电影（标题页 → 推门 → 自动行走 → 交还控制权）

**Files:**
- Create: `src/ui/TitleScreen.tsx`, `src/systems/IntroSequence.tsx`
- Modify: `src/App.tsx`, `src/app/store.ts`（phase 流转）

**Interfaces:**
- Consumes: store 的 phase（title → intro → play）
- Produces: 完整开场：标题页点击「推门进院」→ phase=intro → 小人从 (0,17) 自动走到廊亭 (0,1)（IntroSequence 每帧 setTarget）→ 走到后 phase=play，控制权交给玩家；intro 期间 ClickToMove 不响应（ClickToMove 的 handler 里检查 `phase !== 'play'` 时 return）

- [ ] **Step 1: 写 TitleScreen.tsx**

```tsx
import { useGame } from '../app/store';

export default function TitleScreen() {
  const phase = useGame((s) => s.phase);
  const setPhase = useGame((s) => s.setPhase);
  if (phase !== 'title') return null;
  return (
    <div
      onClick={() => setPhase('intro')}
      style={{
        position: 'fixed', inset: 0, zIndex: 30, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #a4c8e8 0%, #f4e4c1 100%)',
        color: '#4a3728', userSelect: 'none',
      }}
    >
      <h1 style={{ fontSize: 'min(13vw, 72px)', margin: 0, letterSpacing: '0.12em', fontWeight: 700 }}>
        姥姥家的小院
      </h1>
      <p style={{ fontSize: 'min(4.5vw, 20px)', opacity: 0.75, margin: '16px 0 48px' }}>
        夏天午后 · 点哪儿，人就走哪儿
      </p>
      <div
        style={{
          fontSize: 'min(5vw, 24px)', padding: '14px 44px', borderRadius: 999,
          background: '#c9a06a', color: '#fff', boxShadow: '0 6px 24px rgba(120,80,40,.35)',
        }}
      >
        推门进院
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 写 IntroSequence.tsx**

```tsx
import { useFrame } from '@react-three/fiber';
import { useGame } from '../app/store';
import { useRef } from 'react';

const WAYPOINTS: ReadonlyArray<{ x: number; z: number }> = [
  { x: 0, z: 14 }, { x: 0, z: 7 }, { x: 0, z: 1 },
];

export default function IntroSequence() {
  const wp = useRef(0);
  useFrame(() => {
    const g = useGame.getState();
    if (g.phase !== 'intro') return;
    if (!g.target) {
      if (wp.current < WAYPOINTS.length) {
        g.setTarget({ ...WAYPOINTS[wp.current] });
        wp.current += 1;
      } else {
        g.setPhase('play');
      }
    }
  });
  return null;
}
```

- [ ] **Step 3: 流程接线**

1. `src/systems/ClickToMove.tsx` 的 handleUp 开头加：`if (useGame.getState().phase !== 'play') return;`
2. `src/systems/Kid.tsx` 的走位条件已有 `g.phase !== 'title'` → 保持（intro 也要走）
3. App.tsx Canvas 内加 `<IntroSequence />`，DOM 层加 `<TitleScreen />`
4. Kid 初始位置改为 (0, 17)（门内），yaw 朝北（0）

- [ ] **Step 4: 人工验证完整流程**

`npm run dev`：
1. 标题页显示 → 点击 → 标题淡出（暂无动画，直接消失可接受）
2. 小人自动从门口走到廊亭下，途中镜头跟随
3. 到廊亭后可自由点击行走（控制权已交还）
4. intro 期间点击地面无效（验证 Step 3.1）

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 开场——标题页/自动行走小电影/控制权交接"
```

---

### Task 9: Hotspot 物件化（12 物件的 mesh + 点击挂 userData + 各自动效接线）

**Files:**
- Create: `src/scene/hotspot-props/Gate.tsx`, `Trees.tsx`, `Cats.tsx`, `CorridorProps.tsx`, `BackyardProps.tsx`, `FrontyardProps.tsx`, `HotspotRegistry.tsx`
- Modify: `src/scene/Sections.tsx`（占位体块改为引用 hotspot 组件）, `src/App.tsx`

**Interfaces:**
- Consumes: `hotspots`（data.ts）、`useGame`（触发动效/打开记忆卡）、`AnimKind`
- Produces: `<HotspotRegistry />`——遍历 hotspots.json，为每个 id 渲染对应 3D 组件；每个可交互 mesh 均带 `userData={{ hotspotId: 'xxx' }}`；动效通过统一的 `useHotspotAnim(anim, groupRef)` hook 触发（本任务创建于 `src/systems/useHotspotAnim.ts`）

**动效语义（每个都是程序化变换，无骨骼动画）:**
- `shake`：绕 z 轴小幅高频旋转（树/藤）
- `wobble`：低频大幅摇摆（仙人掌/月季）
- `ripple`：scale 呼吸（菜地）
- `liftDoor`：门板绕底边 y 轴旋转 70°（大门）
- `curtain`：scale.y 抖动（门帘/堂屋）
- `water`：粒子向上喷（压水井，Points）
- `lightFlow`：材质 opacity/emissive 呼吸（老院门光影）
- `catLazy/catAlert/catFriendly`：猫的翻身/跑开/走来（位移+旋转）

- [ ] **Step 1: 写动效 hook src/systems/useHotspotAnim.ts**

```ts
import { useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGame } from '../app/store';
import type { AnimKind } from '../content/types';
import type { HotspotId } from '../content/types';

/**
 * 监听 store：openHotspot === id 时，在 DURATION 内按 anim 类型驱动 groupRef。
 * 返回 ref 挂到物件根 group 上。
 */
export function useHotspotAnim(id: HotspotId, anim: AnimKind) {
  const ref = useRef<Group>(null!);
  const clock = useRef<number | null>(null);

  useFrame((state) => {
    const g = useGame.getState();
    const active = g.openHotspot === id;
    if (active && clock.current === null) clock.current = 0;
    if (!active && clock.current !== null && clock.current > 0.5) clock.current = null;
    if (clock.current === null) return;
    clock.current += state.clock.getDelta();
    const t = clock.current;
    const grp = ref.current;
    if (!grp) return;

    switch (anim) {
      case 'shake': // 3 秒内衰减摇摆
        grp.rotation.z = Math.sin(t * 18) * 0.08 * Math.max(0, 1 - t / 3);
        break;
      case 'wobble':
        grp.rotation.x = Math.sin(t * 4) * 0.15 * Math.max(0, 1 - t / 3);
        break;
      case 'ripple': {
        const s = 1 + Math.sin(t * 6) * 0.04 * Math.max(0, 1 - t / 3);
        grp.scale.set(s, 1, s);
        break;
      }
      case 'liftDoor': // 门开到 70°
        grp.rotation.y = -Math.min(1, t / 0.8) * (Math.PI * 0.39);
        break;
      case 'curtain':
        grp.scale.y = 1 + Math.sin(t * 9) * 0.06 * Math.max(0, 1 - t / 2.5);
        break;
      case 'lightFlow': {
        const m = (grp.children[0] as { material?: { opacity: number; emissiveIntensity?: number } });
        if (m?.material) {
          m.material.transparent = true;
          m.material.opacity = 0.5 + Math.sin(t * 2.4) * 0.35;
        }
        break;
      }
      // 猫的动效在 Cats.tsx 内部实现（需要多只协调），此处跳过
      case 'catLazy': case 'catAlert': case 'catFriendly': break;
      case 'water': case 'particles': break; // 粒子动效在专属组件实现
    }
    if (t > 3.5) { // 复位
      grp.rotation.z = 0; grp.rotation.x = 0; grp.scale.set(1, 1, 1); grp.rotation.y = 0;
    }
  });

  return ref;
}
```

- [ ] **Step 2: 写物件组件（每个文件含数个物件）**

`src/scene/hotspot-props/Gate.tsx`：
```tsx
import { useHotspotAnim } from '../../systems/useHotspotAnim';

export default function Gate() {
  const ref = useHotspotAnim('gate', 'liftDoor');
  return (
    <group position={[0, 0, 18]}>
      <group ref={ref}>
        {/* 两扇门板；userData 标记可交互 */}
        <mesh position={[-0.5, 1, 0]} castShadow userData={{ hotspotId: 'gate' }}>
          <boxGeometry args={[1, 2, 0.12]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
        <mesh position={[0.5, 1, 0]} castShadow userData={{ hotspotId: 'gate' }}>
          <boxGeometry args={[1, 2, 0.12]} />
          <meshLambertMaterial color="#7a5c3e" />
        </mesh>
      </group>
    </group>
  );
}
```

`src/scene/hotspot-props/Trees.tsx`（枣树 + 月季）：
```tsx
import { useHotspotAnim } from '../../systems/useHotspotAnim';

export function JujubeTree() {
  const ref = useHotspotAnim('jujube-tree', 'shake');
  return (
    <group position={[-3, 0, 8]}>
      <group ref={ref} userData={{ hotspotId: 'jujube-tree' }}>
        <mesh position={[0, 1.5, 0]} castShadow userData={{ hotspotId: 'jujube-tree' }}>
          <cylinderGeometry args={[0.28, 0.4, 3, 8]} />
          <meshLambertMaterial color="#6b4f2f" />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow userData={{ hotspotId: 'jujube-tree' }}>
          <sphereGeometry args={[1.6, 12, 10]} />
          <meshLambertMaterial color="#4a7a2e" />
        </mesh>
      </group>
    </group>
  );
}

export function Roses() {
  const ref = useHotspotAnim('roses', 'wobble');
  return (
    <group position={[5, 0, -8]}>
      <group ref={ref} userData={{ hotspotId: 'roses' }}>
        <mesh position={[0, 0.45, 0]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.55, 10, 8]} />
          <meshLambertMaterial color="#3f6b2a" />
        </mesh>
        <mesh position={[0.18, 0.85, 0.1]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshLambertMaterial color="#d4547a" />
        </mesh>
        <mesh position={[-0.2, 0.8, -0.1]} castShadow userData={{ hotspotId: 'roses' }}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshLambertMaterial color="#d4547a" />
        </mesh>
      </group>
    </group>
  );
}
```

`src/scene/hotspot-props/Cats.tsx`（三只猫，各自独立动效；点击「猫群」任意一只都触发 cats hotspot）：
```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';

function Cat({ offset, color }: { offset: [number, number, number]; color: string }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = useGame.getState().openHotspot === 'cats';
    if (g.current) {
      // 呼吸起伏（永远在动）+ 被点击时轻微跳一下
      const breathe = Math.sin(t * 1.8 + offset[0]) * 0.015;
      const hop = active ? Math.max(0, Math.sin(t * 6)) * 0.1 : 0;
      g.current.position.y = 1.1 + breathe + hop;
      g.current.rotation.y = offset[0]; // 各自朝向
    }
  });
  return (
    <group ref={g} position={offset}>
      <mesh castShadow userData={{ hotspotId: 'cats' }}>
        <capsuleGeometry args={[0.14, 0.34, 4, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.26, 0.06]} castShadow userData={{ hotspotId: 'cats' }}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[-0.08, 0.3, -0.14]} rotation={[0.4, 0, -0.3]} userData={{ hotspotId: 'cats' }}>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0.08, 0.3, -0.14]} rotation={[0.4, 0, 0.3]} userData={{ hotspotId: 'cats' }}>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function Cats() {
  return (
    <group position={[-6, 0, 1.5]}>
      <Cat offset={[0, 1.1, 0]} color="#e8a04c" />       {/* 慵懒·橙 */}
      <Cat offset={[0.8, 1.1, 0.5]} color="#4a4a4a" />   {/* 警惕·灰 */}
      <Cat offset={[-0.7, 1.1, 0.6]} color="#f0ede6" />  {/* 亲人·白 */}
    </group>
  );
}
```

`src/scene/hotspot-props/CorridorProps.tsx`（老院门/围墙仙人掌/葡萄藤/菜地）、`BackyardProps.tsx`（堂屋门帘/压水井+水花粒子）、`FrontyardProps.tsx`（新房门）——结构同上模式：`useHotspotAnim` + `userData`，代码骨架完全一致，只是几何体/位置不同。其中压水井 `water` 粒子：
```tsx
function WaterSplash() {
  const ref = useRef<THREE.Points>(null!);
  const N = 40;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);
  useFrame((state) => {
    const active = useGame.getState().openHotspot === 'pump-well';
    const arr = (ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < N; i++) {
      const seed = i * 7.13;
      const t = state.clock.elapsedTime;
      if (active) {
        arr[i * 3] = Math.sin(seed + t * 3) * 0.25;
        arr[i * 3 + 1] = Math.abs(Math.sin(seed * 2 + t * 4)) * 0.8;
        arr[i * 3 + 2] = Math.cos(seed * 3 + t * 3) * 0.25;
      } else {
        arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 0;
      }
    }
    (ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} position={[3, 1.4, -11]}><pointsMaterial size={0.06} color="#7ec8e3" /></points>;
}
```
（useMemo 需从 react import。）

- [ ] **Step 3: 写 HotspotRegistry.tsx 汇总渲染 + 替换 Sections 占位**

```tsx
import Gate from './Gate';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';

export default function HotspotRegistry() {
  return (
    <>
      <Gate />
      <JujubeTree />
      <Roses />
      <Cats />
      <CorridorProps />
      <BackyardProps />
      <FrontyardProps />
    </>
  );
}
```
`Sections.tsx` 删除被替换的占位体块（枣树/大门/月季/压水井等），只保留纯装饰性结构（廊亭柱梁/围墙/房屋体块）。App.tsx 加 `<HotspotRegistry />`。

- [ ] **Step 4: 全链路人工验证（核心里程碑）**

`npm run dev` 完整走一遍：
1. 标题 → 推门 → 小人自动走到廊亭
2. 依次点击：枣树（摇摆）、大门（开门）、猫（跳）、月季（摇）、老院门（光影）、压水井（水花）
3. 每次点击：小人先走到 standAt → 物件动效 → 记忆卡滑入 → 合上 → 物件复位
4. 走错路/连点/贴墙——无穿模、无死锁

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 12 物件 hotspot 化——mesh 挂载/程序化动效/点击全链路"
```

---

### Task 10: 氛围系统（炊烟/蝴蝶/光斑——永远在动的底噪）

**Files:**
- Create: `src/systems/AmbientLife.tsx`

**Interfaces:**
- Consumes: 无（纯表现层，读时钟）
- Produces: `<AmbientLife />`——蝴蝶 2 只（绕月季/菜地的利萨如曲线）、飘落叶若干（从枣树区域缓慢下落循环）

```tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Butterfly({ center, color }: { center: [number, number, number]; color: string }) {
  const g = useRef<THREE.Group>(null!);
  const wingL = useRef<THREE.Mesh>(null!);
  const wingR = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { x, y, z } = g.current.position;
    void x; void y; void z;
    g.current.position.set(
      center[0] + Math.sin(t * 0.7) * 1.6,
      center[1] + Math.sin(t * 1.3) * 0.4 + 0.2,
      center[2] + Math.sin(t * 0.9 + 1) * 1.2,
    );
    g.current.rotation.y = t * 0.7 + Math.PI / 2;
    const flap = Math.sin(t * 14) * 0.9;
    wingL.current.rotation.y = flap;
    wingR.current.rotation.y = -flap;
  });
  return (
    <group ref={g} position={center}>
      <mesh ref={wingL} position={[0.06, 0, 0]}>
        <planeGeometry args={[0.14, 0.1]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wingR} position={[-0.06, 0, 0]}>
        <planeGeometry args={[0.14, 0.1]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function FallingLeaf({ origin }: { origin: [number, number, number] }) {
  const m = useRef<THREE.Mesh>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    const fall = (t * 0.3) % 4; // 4 秒一轮
    m.current.position.set(
      origin[0] + Math.sin(t * 1.2) * 0.6,
      origin[1] - fall,
      origin[2] + Math.cos(t * 0.8) * 0.4,
    );
    m.current.rotation.set(t * 1.5, t, t * 0.7);
  });
  return (
    <mesh ref={m} position={origin}>
      <planeGeometry args={[0.08, 0.05]} />
      <meshBasicMaterial color="#7aa04a" side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function AmbientLife() {
  return (
    <>
      <Butterfly center={[5, 1.2, -8]} color="#f2b134" />
      <Butterfly center={[6, 1.1, 2]} color="#e88ab0" />
      <FallingLeaf origin={[-3, 3.5, 8]} />
      <FallingLeaf origin={[-2.2, 3.5, 8.5]} />
      <FallingLeaf origin={[-3.8, 3.5, 7.6]} />
    </>
  );
}
```

- [ ] **Step 1: 写入并接入 App.tsx**
- [ ] **Step 2: 人工验证**：蝴蝶绕飞、翅膀扇动；落叶循环飘落；性能无明显掉帧
- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: 氛围系统——蝴蝶绕飞/扇翅/落叶循环"
```

---

### Task 11: 性能与移动端适配（DPR 封顶/降级/触控细节）

**Files:**
- Create: `src/systems/PerformanceGuard.tsx`
- Modify: `src/App.tsx`（Canvas 的 dpr 与 performance 属性）、`index.html`

**Interfaces:**
- Consumes: R3F 的 `useThree(state => state.gl)` 与 `invalidate`（或 frameloop 状态）
- Produces: `<PerformanceGuard />`——监控滚动平均帧时间，连续 2 秒 > 40ms（<25fps）则：1) `gl.setPixelRatio(1)`；2) store 置 `lowPerf: true`（AmbientLife 读取后减半数量）；只在首次触发，不反复切换

- [ ] **Step 1: store 加 lowPerf 字段**

`src/app/store.ts` 增加：
```ts
lowPerf: boolean;
enableLowPerf: () => void;
```
实现：
```ts
lowPerf: false,
enableLowPerf: () => set({ lowPerf: true }),
```

- [ ] **Step 2: 写 PerformanceGuard.tsx**

```tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../app/store';

const SAMPLE_WINDOW = 120; // 帧
const SLOW_MS = 40;        // 单帧阈值

export default function PerformanceGuard() {
  const { gl } = useThree();
  let slow = 0;
  let total = 0;

  useFrame((_, dt) => {
    const g = useGame.getState();
    if (g.lowPerf) return; // 已降级，不再监控
    total++;
    if (dt * 1000 > SLOW_MS) slow++;
    if (total >= SAMPLE_WINDOW && slow / total > 0.5) {
      gl.setPixelRatio(1);
      g.enableLowPerf();
    }
  });

  return null;
}
```

- [ ] **Step 3: Canvas 配置与 index.html 触控**

App.tsx 的 Canvas 加 `dpr={[1, 2]}`、`gl={{ antialias: true, powerPreference: 'high-performance' }}`，Canvas 内挂 `<PerformanceGuard />`。AmbientLife 读 `useGame((s) => s.lowPerf)` 决定蝴蝶/落叶数量减半。

`index.html` 的 meta viewport 已有 `user-scalable=no`；再补 `body { -webkit-tap-highlight-color: transparent; }` 与 `overscroll-behavior: none`。

- [ ] **Step 4: 人工验证 + Commit**

验证：Chrome DevTools 切设备模拟 + CPU 6x slowdown → 页面自动降级（DPR 1 + 粒子减半），操作仍流畅。

```bash
git add -A
git commit -m "feat: 性能守卫——帧率监控/自动降级/DPR 封顶"
```

---

### Task 12: 加载体验与构建产物检查（Loading UI + 体积红线）

**Files:**
- Create: `src/ui/LoadingHint.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: R3F 的 `onCreated` / Suspense
- Produces: 首帧渲染前的白屏保护——`#f4e4c1` 底色 + 「正在推开院门...」文字；构建产物 ≤ 15MB 的红线检查脚本

- [ ] **Step 1: 写 LoadingHint.tsx（React lazy/Suspense 层面，MVP 阶段资源全内联，这个 UI 主要防 3D 初始化闪白）**

```tsx
export default function LoadingHint() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 40, background: '#f4e4c1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8a6f52', fontSize: 20, letterSpacing: '0.2em',
      }}
    >
      正在推开院门 ...
    </div>
  );
}
```

- [ ] **Step 2: App.tsx 用 React.Suspense + Canvas onCreated 隐藏 LoadingHint**

Canvas 的 `onCreated` 里调用 `useGame.setState({ phase: 'title' })` 不需要——初始就是 title。改为：LoadingHint 由本地 state 控制，`<Canvas onCreated={() => setReady(true)}>`，ready 前显示。

- [ ] **Step 3: 构建体积检查**

```bash
npm run build
du -sh dist/    # 期望 ≤ 15MB（MVP 占位几何体阶段应远小于 1MB + three 本身 ~600KB gzip 前）
```

写进 `scripts/check-size.mjs`（package.json scripts 加 `"size": "node scripts/check-size.mjs"`）：
```js
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
let total = 0;
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else total += statSync(p).size;
  }
};
walk(dist);
const mb = total / 1024 / 1024;
console.log(`dist 总体积: ${mb.toFixed(2)} MB`);
if (mb > 15) { console.error('✗ 超过 15MB 红线'); process.exit(1); }
console.log('✓ 体积达标');
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 加载提示与体积红线检查"
```

---

### Task 13: Playwright 冒烟测试 + 微信内真机验证清单

**Files:**
- Create: `e2e/smoke.spec.ts`, `playwright.config.ts`
- Create: `docs/WECHAT-CHECKLIST.md`

**Interfaces:**
- Consumes: 全部前置任务
- Produces: CI 可跑的冒烟测试 + 人工真机检查清单

- [ ] **Step 1: 安装与配置**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

`playwright.config.ts`：
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 2: 写冒烟测试 e2e/smoke.spec.ts**

```ts
import { test, expect } from '@playwright/test';

test('标题页 → 推门 → 自由行走 → 点击枣树出记忆卡', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('姥姥家的小院')).toBeVisible();
  await page.getByText('推门进院').click();

  // 等 intro 走完（3 路点 × 若干秒），上限 20s
  await page.waitForFunction(
    () => (window as unknown as { __phase?: string }).__phase === 'play',
    undefined, { timeout: 20000 },
  );

  // 点击屏幕中下部的地面（相对坐标）走一步
  await page.mouse.click(640, 500);
  await page.waitForTimeout(1500);

  // 点击枣树方向（画布坐标按 1280x720 假设，intro 后镜头朝北，枣树在前院左侧）
  await page.mouse.click(400, 300);
  // 记忆卡出现（标题「那棵枣树」）
  await expect(page.getByText('那棵枣树', { exact: false })).toBeVisible({ timeout: 15000 });
  // 合上
  await page.getByText('合上回忆').click();
  await expect(page.getByText('合上回忆')).toBeHidden();
});
```
配套：`src/app/store.ts` 里把 phase 变化同步到 window 便于测试：
```ts
// store.ts 末尾追加（每次 set 后同步）
useGame.subscribe((s) => {
  if (typeof window !== 'undefined') (window as unknown as { __phase?: string }).__phase = s.phase;
});
```

- [ ] **Step 3: 跑通测试**

```bash
npx playwright test
```
期望：PASS。若画布坐标点击不可靠（相机角度原因点不到枣树），允许把该断言放宽为「点击画面任意 hotspot 或在 store 直接 setOpenHotspot 后记忆卡可见」——**测试的目标是链路可用，不是像素级精确**。

- [ ] **Step 4: 写 docs/WECHAT-CHECKLIST.md（人工真机清单）**

```markdown
# 微信真机验证清单

每阶段发版前，把 dist 部署到任意 https 静态托管，在微信里打开走一遍：

- [ ] 标题页正常显示，字体不溢出
- [ ] 点「推门进院」后 3D 场景能渲染（WebGL 上下文创建成功）
- [ ] 小人行走流畅（体感 ≥ 30fps）
- [ ] 点击物件 → 走近 → 动效 → 记忆卡，全链路在触屏上无 300ms 延迟感
- [ ] 记忆卡文字大小在手机上可读（长辈视角）
- [ ] 「合上回忆」按钮在触屏上好按（≥ 44px 高）
- [ ] 手机旋转屏幕不崩、不变形
- [ ] 微信内打开无安全提示拦截
- [ ] 弱网（4G）下首屏加载 ≤ 10s
- [ ] iPhone（Safari 内核）与 Android（X5 内核）各过一遍
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: Playwright 冒烟测试与微信真机验证清单"
```

---

### Task 14: 内容就位与资产替换流程（照片接入 + Tripo 模型路线图）

**Files:**
- Create: `docs/ASSETS.md`
- Modify: `content/hotspots.json`（等用户照片）

**Interfaces:**
- Consumes: 用户提供的真实照片（WebP 处理后入 `content/photos/`）、Tripo 产出的 glTF
- Produces: `docs/ASSETS.md`——给用户的资产生产手册：每个物件的 Tripo 提示词、导出/压缩/替换步骤；照片处理命令

- [ ] **Step 1: 写 docs/ASSETS.md（核心内容：每物件一行 Tripo 提示词 + 统一流程）**

```markdown
# 资产生产手册（Tripo → 小院）

## 通用流程
1. 打开 Tripo（tripo3d.ai），选「图生 3D」
2. 贴一张该物件的真实照片（或用下方文字提示词）
3. 导出 glTF（低多边形风格可在提示词里要求 low-poly, stylized, flat shading）
4. 压缩：`npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`
5. 放入 `assets/models/<id>.glb`，单文件 ≤ 1MB（超过就减面/降贴图）
6. 在对应组件里替换占位几何体（`<Capsule>` → `<useGLTF>`）

## 各物件提示词（可直接复制）
| 物件 | 提示词 |
|---|---|
| 枣树 | jujube tree, low-poly stylized, gnarled trunk, dense green canopy, small red dates, flat shading, game asset |
| 大门 | rural chinese courtyard double wooden gate, low-poly, weathered wood, iron hinges, flat shading |
| 压水井 | cast iron hand water pump, low-poly stylized, rural china 1990s, flat shading |
| 葡萄藤 | grape vine pergola with green and purple grapes, low-poly stylized, flat shading |
| 仙人掌 | potted cactus on brick wall top, low-poly stylized, flat shading |
| 猫 | sleeping orange cat curled up, low-poly stylized, cute, flat shading（×3 换颜色） |
| 堂屋门 | traditional chinese wooden door with cotton door curtain, low-poly stylized, flat shading |
| 月季 | chinese rose bush with pink flowers, low-poly stylized, flat shading |
| 小人 | 6-year-old chinese kid, low-poly stylized, standing, t-shirt and shorts, flat shading, game character |

## 照片处理（cwebp）
brew install webp
cwebp -q 80 -resize 1600 0 input.jpg -o output.webp
```

- [ ] **Step 2: 照片占位策略**

照片就位前，`hotspots.json` 不写 photo 字段（记忆卡自动不显示图片区域）；每张照片就位后：加 photo 字段 → `npm run validate` 校验通过 → commit。此任务在照片到位前**保持 open**（不阻断其他任务）。

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: 资产生产手册——Tripo 提示词/压缩流程/照片处理"
```

---

## 任务依赖图

```
Task 1 脚手架
  └─ Task 2 场景骨架
       ├─ Task 3 内容系统 ─────────────┐
       └─ Task 4 点击寻路 ←───────────┘（4 需要 3 的 data.ts）
            ├─ Task 5 小人
            │    └─ Task 6 跟随相机
            ├─ Task 7 记忆卡 UI
            ├─ Task 8 开场小电影
            ├─ Task 9 Hotspot 物件化 ←─ 依赖 3+4+7
            ├─ Task 10 氛围系统
            ├─ Task 11 性能守卫
            └─ Task 12 加载与体积
Task 13 冒烟测试 ←─ 依赖 8+9（全链路）
Task 14 资产手册 ←─ 独立（照片到位前 open）
```

## 完成定义（MVP Done）

1. Task 1-13 全部完成，`npm run build && npm run size && npx playwright test` 全绿
2. 微信真机清单（docs/WECHAT-CHECKLIST.md）人工过一遍
3. `content/hotspots.json` 的草稿文字已替换为用户本人写的回忆（或明确标注待写）
4. 占位几何体可全部替换为 Tripo 模型（Task 14 手册就绪，替换可持续进行，不阻断 MVP 发布）
