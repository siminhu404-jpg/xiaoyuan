# 小院灰盒空间对齐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use likecode:subagent-driven-development (recommended) or likecode:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Three.js 占位场景对齐到“两进院落”俯瞰布局，使外门、外院、内院门、菜地、葡萄架、压水井和堂屋形成可自由探索且可通行的空间骨架。

**Architecture:** 保留现有 React Three Fiber 场景和 x/z 坐标系统，不引入导航网格或新依赖。把公共空间锚点集中到 `src/scene/layout.ts`，让结构体块、碰撞体和热点配置引用同一套经过测试的坐标；灰盒阶段只修改几何体、碰撞和内容位置，不制作正式模型、不重写移动系统。

**Tech Stack:** React 18.3.1、TypeScript 5、React Three Fiber 8、Three.js 0.169、Vitest 2、Vite 5。

## Global Constraints

- **坐标系统**：x 轴东西（东为 +x）；z 轴南北（北为 -z，南为 +z）。
- **场地范围**：`x ∈ [-12, 12]`，`z ∈ [-18, 20]`。
- **区域结构**：外院 `z ∈ [6, 20]`、过渡区 `z ∈ [-2, 6]`、内院 `z ∈ [-18, -2]`。
- **自由探索**：外门打开后不设置区域锁定、钥匙、任务清单或不可逆关卡。
- **通行要求**：主通道宽度约 2.2m；核心热点前保留约 2.5～3m 停留空间；人物和小黑不得被结构体块频繁卡住。
- **小黑职责**：只跟随和陪伴，不导航、不解锁、不触发热点。
- **性能预算**：首次加载 ≤ 15MB；中端手机目标 60fps；不新增运行时依赖。
- **内容分离**：热点文案和位置继续存放在 `content/hotspots.json`；场景结构坐标存放在 `src/scene/layout.ts`。
- **验证要求**：逻辑改动运行 `npm test`；整体改动运行 `npm run build`、`npm run validate`、`npm run size`。

---

## 文件结构

- **Modify:** `src/scene/layout.ts` — 新增灰盒空间锚点、通道和结构尺寸，作为唯一坐标来源。
- **Create:** `src/scene/layout.test.ts` — 验证锚点、区域关系和通行间距。
- **Modify:** `src/scene/Sections.tsx` — 按两进院落重排房屋、内院门、双侧菜地和葡萄架的占位几何体。
- **Modify:** `src/systems/obstacles.ts` — 将碰撞圆更新到新的结构位置，保持人物可从外门走到堂屋。
- **Modify:** `content/hotspots.json` — 将 12 个热点的 `position` / `standAt` 对齐到灰盒锚点；不改文案内容和热点 id。
- **Modify:** `src/scene/hotspot-props/CorridorProps.tsx` — 将菜地作物、葡萄藤和过渡区装饰对齐到新的双侧菜地/葡萄架体块。
- **Modify:** `src/scene/hotspot-props/FrontyardProps.tsx` — 将东西房屋门面与缩小后的侧房体块对齐。
- **Modify:** `src/scene/hotspot-props/BackyardProps.tsx` — 将堂屋门帘、压水井和水花发射点对齐到新的内院锚点。
- **Create:** `src/content/placement.test.ts` — 验证热点站立点在可行走范围内、核心路径没有明显越界或贴墙点。
- **Modify:** `docs/ASSETS.md` — 将第一批资产的空间分区和灰盒替换顺序补充到现有资产手册。

---

### Task 1: 建立可测试的空间锚点

**Files:**
- Modify: `src/scene/layout.ts`
- Create: `src/scene/layout.test.ts`

**Interfaces:**
- Consumes: 现有 `SCENE_BOUNDS`、`SECTIONS`、`GATE_POS`、`WALK_BOUNDS`。
- Produces: `LANDMARKS`、`STRUCTURES`、`WALK_LANES` 三个只读常量，供场景、碰撞和内容定位任务使用。

- [ ] **Step 1: Write the failing tests**

在 `src/scene/layout.test.ts` 写入：

```ts
import { describe, expect, it } from 'vitest';
import { GATE_POS, LANDMARKS, SCENE_BOUNDS, SECTIONS, WALK_BOUNDS } from './layout';

const distance = (a: readonly [number, number], b: readonly [number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('灰盒空间布局', () => {
  it('保持从南到北的两进院落顺序', () => {
    expect(GATE_POS[1]).toBeGreaterThan(LANDMARKS.innerGate[1]);
    expect(LANDMARKS.innerGate[1]).toBeGreaterThan(LANDMARKS.mainRoom[1]);
    expect(LANDMARKS.mainRoom[1]).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
  });

  it('所有核心锚点落在场地内', () => {
    for (const [name, [x, z]] of Object.entries(LANDMARKS)) {
      expect(x, `${name}.x`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minX);
      expect(x, `${name}.x`).toBeLessThanOrEqual(SCENE_BOUNDS.maxX);
      expect(z, `${name}.z`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
      expect(z, `${name}.z`).toBeLessThanOrEqual(SCENE_BOUNDS.maxZ);
    }
  });

  it('主通道在内院门和堂屋之间保留可行走宽度', () => {
    expect(WALK_LANES.main.width).toBeGreaterThanOrEqual(2.2);
    expect(distance(WALK_LANES.main.from, WALK_LANES.main.to)).toBeGreaterThan(10);
    expect(SECTIONS.corridor.zMin).toBeLessThan(SECTIONS.corridor.zMax);
    expect(WALK_BOUNDS.minX).toBeLessThan(0);
    expect(WALK_BOUNDS.maxX).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/scene/layout.test.ts`

Expected: FAIL because `LANDMARKS` and `WALK_LANES` are not exported yet.

- [ ] **Step 3: Add the canonical anchors**

在 `src/scene/layout.ts` 保留现有导出，并追加：

```ts
/** 两进院落的核心空间锚点，坐标为 [x, z]，单位为米。 */
export const LANDMARKS = {
  gate: [0, 18],
  jujubeTree: [7, 8.5],
  westVegetablePatch: [-6, 5],
  eastVegetablePatch: [6, 5],
  westGrapeVine: [-6, 2],
  eastGrapeVine: [6, 2],
  innerGate: [0, -1],
  cats: [-6, 0],
  pumpWell: [6, -7],
  westRoses: [-5, -8],
  eastRoses: [5, -8],
  mainRoom: [0, -15],
} as const;

/** 结构体块使用的尺寸，格式为 x/y/z，单位为米。 */
export const STRUCTURES = {
  sideHouse: [6, 3.4, 5] as const,
  mainRoom: [10, 3.2, 4.5] as const,
  innerGate: [3.2, 3, 0.8] as const,
  grapePergola: [5.2, 2.8, 3] as const,
  vegetablePatch: [5, 0.35, 3.5] as const,
} as const;

/** 人物和小黑共用的主要行走通道。 */
export const WALK_LANES = {
  main: {
    from: [0, 17] as const,
    to: [0, -11] as const,
    width: 2.4,
  },
  east: {
    from: [1.5, 8] as const,
    to: [1.5, -10] as const,
    width: 2.2,
  },
  west: {
    from: [-1.5, 8] as const,
    to: [-1.5, -10] as const,
    width: 2.2,
  },
} as const;
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- --run src/scene/layout.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/scene/layout.ts src/scene/layout.test.ts
git commit -m "feat: define courtyard graybox landmarks"
```

---

### Task 2: 重排场景结构体块

**Files:**
- Modify: `src/scene/Sections.tsx`

**Interfaces:**
- Consumes: `LANDMARKS`、`STRUCTURES`、`WALK_LANES` from `src/scene/layout.ts`。
- Produces: 可在现有 Canvas 中显示的两进院落灰盒：外院侧房、双侧菜地、双侧葡萄架、内院门、内院堂屋。

- [ ] **Step 1: Replace hard-coded structural positions with layout imports**

在 `Sections.tsx` 中使用 `LANDMARKS` 和 `STRUCTURES`，删除当前把堂屋放在 `[-3, 1.5, -15]`、把枣树所在房屋固定为左右两个圆形占位的旧结构写法。结构应满足以下位置：

```tsx
import { LANDMARKS, STRUCTURES } from './layout';
```

- 堂屋：中心 x 使用 `LANDMARKS.mainRoom[0]`，z 使用 `LANDMARKS.mainRoom[1]`，尺寸 `STRUCTURES.mainRoom`。
- 西房：中心 `[-7, 1.7, 13]`，尺寸 `STRUCTURES.sideHouse`。
- 东房：中心 `[7, 1.7, 13]`，尺寸 `STRUCTURES.sideHouse`。
- 内院门：中心 `[LANDMARKS.innerGate[0], 1.5, LANDMARKS.innerGate[1]]`，使用两根柱子和一根横梁，门洞宽度至少 2.2m。
- 西侧菜地：中心 x/z 使用 `LANDMARKS.westVegetablePatch`，平面尺寸使用 `STRUCTURES.vegetablePatch`。
- 东侧菜地：中心 x/z 使用 `LANDMARKS.eastVegetablePatch`，平面尺寸使用 `STRUCTURES.vegetablePatch`。
- 西侧葡萄架：中心 x/z 使用 `LANDMARKS.westGrapeVine`，长度沿 x 轴，宽度不侵入主通道。
- 东侧葡萄架：中心 x/z 使用 `LANDMARKS.eastGrapeVine`，长度沿 x 轴，宽度不侵入主通道。

灰盒阶段继续使用 `boxGeometry` 和 `meshLambertMaterial`；不加入 GLB、不加贴图、不新增材质库。

- [ ] **Step 2: Run typecheck and build**

Run: `npm run build`

Expected: TypeScript 和 Vite 构建通过，无 unused import 或 tuple 类型错误。

- [ ] **Step 3: Manually verify the scene**

Run: `npm run dev`

Verify in the browser：

1. 外门方向能看到中间主通道；
2. 双侧菜地和葡萄架不封住中路；
3. 内院门位于过渡区北侧；
4. 堂屋位于最北侧；
5. 左右房屋只形成边界，不覆盖可走区域。

- [ ] **Step 4: Commit**

```bash
git add src/scene/Sections.tsx
git commit -m "feat: align scene graybox to two-courtyard layout"
```

---

### Task 3: 对齐碰撞体并验证主路径

**Files:**
- Modify: `src/systems/obstacles.ts`
- Modify: `src/systems/movement.test.ts`

**Interfaces:**
- Consumes: Task 1 的 `LANDMARKS` 与场景结构尺寸。
- Produces: 与灰盒结构体块一致的 `OBSTACLES`，人物可以从外门、外院、内院门走到堂屋附近。

- [ ] **Step 1: Add path-level collision tests**

在 `src/systems/movement.test.ts` 追加：

```ts
import { OBSTACLES } from './obstacles';

it('外门到堂屋的主通道不被圆形障碍连续封死', () => {
  const samples = [
    { x: 0, z: 16 },
    { x: 0, z: 10 },
    { x: 0, z: 4 },
    { x: 0, z: -4 },
    { x: 0, z: -11 },
    { x: -1.1, z: -11 },
    { x: 1.1, z: -11 },
  ];

  for (const point of samples) {
    const resolved = resolveCollision(point.x, point.z, OBSTACLES);
    expect(resolved.x, `x at z=${point.z}`).toBeCloseTo(point.x, 1);
    expect(resolved.z, `z at z=${point.z}`).toBeCloseTo(point.z, 1);
  }
});
```

- [ ] **Step 2: Run the test and verify the new scenario fails or exposes stale positions**

Run: `npm test -- --run src/systems/movement.test.ts`

Expected: 新增路径测试在旧结构碰撞仍覆盖主通道时 FAIL，或在结构未冲突时 PASS；如果已经 PASS，仍需完成下一步位置对齐并重新验证。

- [ ] **Step 3: Replace stale obstacle positions**

将 `src/systems/obstacles.ts` 的 `OBSTACLES` 调整为与灰盒结构一致：

```ts
import { LANDMARKS } from '../scene/layout';

export const OBSTACLES: readonly Obstacle[] = [
  // 堂屋南立面两侧，给中央门帘保留约 2.8m 入口。
  { x: -3.4, z: LANDMARKS.mainRoom[1], r: 2.0 },
  { x: 3.4, z: LANDMARKS.mainRoom[1], r: 2.0 },
  { x: -7, z: 13, r: 3.4 },
  { x: 7, z: 13, r: 3.4 },
  { x: LANDMARKS.pumpWell[0], z: LANDMARKS.pumpWell[1], r: 0.75 },
  { x: LANDMARKS.westRoses[0], z: LANDMARKS.westRoses[1], r: 0.7 },
  { x: LANDMARKS.eastRoses[0], z: LANDMARKS.eastRoses[1], r: 0.7 },
  { x: -1.6, z: LANDMARKS.innerGate[1], r: 0.45 },
  { x: 1.6, z: LANDMARKS.innerGate[1], r: 0.45 },
  { x: LANDMARKS.jujubeTree[0], z: LANDMARKS.jujubeTree[1], r: 0.85 },
];
```

不要为菜地和葡萄架的整个面积添加大圆形障碍；它们只占用边缘，主通道必须保持开放。

- [ ] **Step 4: Run movement tests**

Run: `npm test -- --run src/systems/movement.test.ts`

Expected: PASS，包含原有边界、推出和 `stepToward` 测试。

- [ ] **Step 5: Commit**

```bash
git add src/systems/obstacles.ts src/systems/movement.test.ts
 git commit -m "fix: align graybox collisions with courtyard paths"
```

---

### Task 4: 对齐热点位置与站立点

**Files:**
- Modify: `content/hotspots.json`
- Modify: `src/scene/hotspot-props/CorridorProps.tsx`
- Modify: `src/scene/hotspot-props/FrontyardProps.tsx`
- Modify: `src/scene/hotspot-props/BackyardProps.tsx`
- Create: `src/content/placement.test.ts`

**Interfaces:**
- Consumes: `LANDMARKS` 的灰盒位置；运行时继续通过现有 `src/content/data.ts` 加载 JSON；现有热点 prop 组件的 `position` / `group` 结构。
- Produces: 保持现有 12 个 `HotspotId` 不变的热点地图和与灰盒体块一致的装饰物位置，所有核心 `standAt` 在行走范围和合理停留区内。

- [ ] **Step 1: Write placement validation tests**

新建 `src/content/placement.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import hotspots from '../../content/hotspots.json';
import { WALK_BOUNDS } from '../scene/layout';

describe('hotspot graybox placement', () => {
  it('每个热点有可行走的站立点', () => {
    for (const hotspot of hotspots.hotspots) {
      const [x, z] = hotspot.standAt;
      expect(x, `${hotspot.id}.standAt.x`).toBeGreaterThanOrEqual(WALK_BOUNDS.minX);
      expect(x, `${hotspot.id}.standAt.x`).toBeLessThanOrEqual(WALK_BOUNDS.maxX);
      expect(z, `${hotspot.id}.standAt.z`).toBeGreaterThanOrEqual(WALK_BOUNDS.minZ);
      expect(z, `${hotspot.id}.standAt.z`).toBeLessThanOrEqual(WALK_BOUNDS.maxZ);
    }
  });

  it('保留外门到堂屋的空间层次', () => {
    const byId = Object.fromEntries(hotspots.hotspots.map((hotspot) => [hotspot.id, hotspot]));
    expect(byId.gate.position[1]).toBeGreaterThan(byId.old-door.position[1]);
    expect(byId.old-door.position[1]).toBeGreaterThan(byId.main-room.position[1]);
  });
});
```

- [ ] **Step 2: Run the placement test and verify it reflects the current data**

Run: `npm test -- --run src/content/placement.test.ts`

Expected: 如果现有热点仍在范围内且南北顺序正确则 PASS；否则先根据失败的 id 调整 JSON。

- [ ] **Step 3: Update the hotspot positions**

保持所有 id、label、anim 和 memory 不变，只替换位置为以下灰盒值：

```json
{
  "gate": [[0, 18], [0, 16.5]],
  "new-house-west": [[-7, 13], [-4, 9.5]],
  "new-house-east": [[7, 13], [4, 9.5]],
  "jujube-tree": [[7, 8.5], [5, 8.5]],
  "wall-cactus": [[0, 0.2], [-2, 2.2]],
  "cats": [[-6, 0], [-4.2, 1.2]],
  "grape-vine": [[6, 2], [6, 4.2]],
  "vegetable-patch": [[6, 5], [6, 7]],
  "old-door": [[0, -1], [0, 1.2]],
  "pump-well": [[6, -7], [4.2, -7]],
  "main-room": [[0, -15], [0, -10.8]],
  "roses": [[5, -8], [3.8, -8]]
}
```

每组数组的第一个值写入 `position`，第二个值写入 `standAt`。西侧菜地和葡萄架由场景结构做镜像表现；当前单个热点继续代表该类物件，避免扩大 MVP 的内容 schema。

- [ ] **Step 4: Align hotspot prop visuals with the graybox**

在 `src/scene/hotspot-props/CorridorProps.tsx` 中：

- 将东侧菜地作物组从旧的 z≈2 移到新东侧菜地中心 `LANDMARKS.eastVegetablePatch` 附近，保持作物落在土块范围内；
- 将葡萄藤组从旧的 x≈8.8 调整到东侧葡萄架范围 `x ∈ [3.4, 8.6]` 内；
- 如果组件中存在西侧静态装饰，使用 `LANDMARKS.westVegetablePatch` / `LANDMARKS.westGrapeVine` 对齐；不新增第二个热点 id。

在 `src/scene/hotspot-props/FrontyardProps.tsx` 中：

- 将西房、东房门面 z 调整到新侧房南立面 `z = 10.5`，使门与 `STRUCTURES.sideHouse` 的深度边缘贴合；
- 不改变组件对热点动画的绑定和现有 prop API。

在 `src/scene/hotspot-props/BackyardProps.tsx` 中：

- 将堂屋门帘组从旧的 `[-3, 0, -12.5]` 移到新堂屋南立面中心 `[LANDMARKS.mainRoom[0], 0, LANDMARKS.mainRoom[1] + STRUCTURES.mainRoom[2] / 2]`；
- 将压水井和水花粒子发射点从旧的 `[3, *, -11]` 移到 `LANDMARKS.pumpWell`；
- 保留现有 hotspot id、动画 hook 和组件结构。

- [ ] **Step 5: Run content and placement validation**

Run: `npm test -- --run src/content/placement.test.ts src/content/load.test.ts && npm run validate`

Expected: 测试和内容校验均 PASS，所有 12 个 id 仍唯一，文案不因布局调整被改写。

- [ ] **Step 6: Commit**

```bash
git add content/hotspots.json src/content/placement.test.ts src/scene/hotspot-props/CorridorProps.tsx src/scene/hotspot-props/FrontyardProps.tsx
git commit -m "feat: place hotspots across two courtyard zones"
```

---

### Task 5: 更新资产手册并完成灰盒验收

**Files:**
- Modify: `docs/ASSETS.md`

**Interfaces:**
- Consumes: Task 1～4 的空间锚点和核心资产范围。
- Produces: 美术制作可以直接引用的灰盒分区、替换顺序和验收清单；不改变现有模型压缩和体积预算。

- [ ] **Step 1: Add the graybox layout section**

在 `docs/ASSETS.md` 的通用流程之后补充：

```md
## 灰盒空间与首批替换顺序

场景采用两进院落：南侧外门 → 外院 → 内院门 → 北侧堂屋。正式模型替换前，先用占位几何体验通行和镜头。

首批正式资产顺序：
1. 外门和门墙
2. 外院地面、两侧房屋外墙
3. 双侧菜地与葡萄架
4. 内院门
5. 堂屋门口和门帘
6. 枣树
7. 压水井
8. 小人和小黑

灰盒验收：主通道宽度约 2.2m；人物与小黑可并行；外门打开后所有区域可到达；内院门不作为锁定关卡；堂屋位于最北侧并形成自然终点。
```

- [ ] **Step 2: Run all validation commands**

Run:

```bash
npm test
npm run build
npm run validate
npm run size
```

Expected: 全部 PASS；`npm run size` 不超过现有 15MB 红线。

- [ ] **Step 3: Run the app for manual graybox review**

Run: `npm run dev`

在桌面端和手机尺寸下检查：

- 外门起点是否清楚；
- 主路是否能直达堂屋；
- 菜地和葡萄架是否可绕行；
- 内院门是否形成明显空间层次；
- 堂屋是否没有被前景结构遮挡；
- 小黑跟随时是否在门洞和转角卡住。

- [ ] **Step 4: Commit documentation**

```bash
git add docs/ASSETS.md
git commit -m "docs: document courtyard graybox asset order"
```

---

## 完成定义

灰盒阶段完成后，应满足：

- `src/scene/layout.ts` 是空间坐标的唯一事实来源；
- `Sections.tsx`、`obstacles.ts` 和 `content/hotspots.json` 的南北关系一致；
- 外门到堂屋的主通道可自由探索；
- 12 个热点 id 和既有交互系统未被破坏；
- 逻辑测试、构建、内容校验和体积检查全部通过；
- 桌面端和手机尺寸人工检查均通过；
- 未引入正式 GLB、美术贴图或新的运行时依赖。

灰盒验收通过后，下一份独立计划应只负责“局部概念图与第一批 3D 资产拆分”，不要在同一计划里混入正式模型接入。
