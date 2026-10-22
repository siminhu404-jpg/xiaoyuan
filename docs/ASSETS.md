# 资产生产手册（Tripo → 小院）

面向你（姥姥家的小院作者）：一份「把真实照片变成小院资产」的操作手册。分两条线：
1. **照片 → 记忆卡**：把真实照片压成 WebP，挂到每个热点的记忆卡上。
2. **照片 / 提示词 → Tripo 3D 模型**：把占位几何体换成有质感的三维物件。

主线完成后，每个热点的「记忆」都有照片、每个物件都有 Tripo 模型，MVP 就算真正「内容就位」了。

---

## 通用流程（The flow）

1. 打开 Tripo（tripo3d.ai），选「图生 3D」
2. 贴一张该物件的真实照片（或用下方文字提示词）
3. 导出 glTF（低多边形风格可在提示词里要求 low-poly, stylized, flat shading）
4. 压缩：`npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`
5. 放入 `assets/models/<id>.glb`，单文件 ≤ 1MB（超过就减面/降贴图）
6. 在对应组件里替换占位几何体（`<Capsule>` → `<useGLTF>`）

> **替换路径对照**：各物件占位几何体都在 `src/scene/hotspot-props/` 下（`Tree.tsx`、`Gate.tsx`、`CorridorProps.tsx`、`BackyardProps.tsx`、`FrontyardProps.tsx`、`Cats.tsx`）；走路的小人（`小人`）在 `src/systems/Kid.tsx`。每改一处，跑一次 `npm run build && npm run size` 确认没超体积红线。

---

## 各物件提示词（可直接复制）

占位体块的尺寸（`目标尺寸`）是从场景源码里量出来的，替换模型时按这个大小摆进场景，比例才不会错。多边形预算：**单个模型 ≤ 5k 三角面，全场景 ≤ 60k**。

| 物件 | 目标尺寸（占位体块参照） | 三角面预算 | 提示词 |
|---|---|---|---|
| 枣树 | 树冠直径 ~3.2m，主干高 ~3m | ≤ 5k | jujube tree, low-poly stylized, gnarled trunk, dense green canopy, small red dates, flat shading, game asset |
| 大门 | 高 ~2m、宽 ~2m、厚 ~0.12m，双扇木门 | ≤ 5k | rural chinese courtyard double wooden gate, low-poly, weathered wood, iron hinges, flat shading |
| 压水井 | 筒身高 ~1m（吸管+手柄整体 ~0.9m） | ≤ 5k | cast iron hand water pump, low-poly stylized, rural china 1990s, flat shading |
| 葡萄藤 | 廊架横梁长 ~3m、架高 ~2.7m | ≤ 5k | grape vine pergola with green and purple grapes, low-poly stylized, flat shading |
| 仙人掌 | 站在墙顶（y≈2.2），主茎高 ~1m | ≤ 5k | potted cactus on brick wall top, low-poly stylized, flat shading |
| 猫 | 卧姿体长 ~0.5m，三只（橙/灰/白） | ≤ 5k × 3（可共用一套模型换色） | sleeping orange cat curled up, low-poly stylized, cute, flat shading（×3 换颜色） |
| 堂屋门 | 门框 1.9m 高，门帘 1.4×2.2m | ≤ 5k | traditional chinese wooden door with cotton door curtain, low-poly stylized, flat shading |
| 月季 | 丛高 ~1m，东西两丛共用一套 | ≤ 5k | chinese rose bush with pink flowers, low-poly stylized, flat shading |
| 小人 | 6 岁儿童身高 ~1.1m（站立，头位 ~1.05m） | ≤ 5k | 6-year-old chinese kid, low-poly stylized, standing, t-shirt and shorts, flat shading, game character |

> 三条实操提示：
> - 猫、月季这类「一处场景多份相同物件」，只导出一套模型，在组件里复制缩放换色即可，别为每只猫单独上传。
> - 小人导出后通常需要用 Mixamo / 骨骼动画补走路动作——占位小人现在就有一个胶囊身+球头的简化人形，替换后记得把刚体/碰撞逻辑（`src/systems/Kid.tsx` 的 `SPEED`、碰撞）对准新模型重心。
> - 压水井导出后请把水花粒子发射点（`BackyardProps.tsx` 的 `WaterSplash`，y≈1.4）对准模型出水口。

---

## 照片处理（cwebp）

真实照片进记忆卡前先压成 WebP，一张 ~100~300KB，比原图省 5~10 倍体积。

```bash
brew install webp
cwebp -q 80 -resize 1600 0 input.jpg -o output.webp
```

处理好的照片放入 `content/photos/`，文件名用 `<id>-<年份>.webp`（例如枣树照片放成 `content/photos/jujube-tree-2020.webp`）。

---

## ♻️ 照片清单（拍摄清单）—— 12 热点记忆照

拍/找齐下面 12 张，每张压成 WebP 放进 `content/photos/`，再在 `content/hotspots.json` 对应热点的 `memory` 里补一行 `"photo": "<文件名>.webp"`，跑 `npm run validate` 通过后 commit 即可。打勾 = 已拍到这类素材：

- [ ] 新大门 — 大门正脸/门环特写 + 进门那一刻的反打
- [ ] 西边新房 — 新房墙面/房檐 + 盖那年的工地或新房落成照
- [ ] 东边新房 — 东屋门口/屋内角落 + 住东屋的那段日子照
- [ ] 枣树 — 树冠/树干特写 + 打枣的场景照
- [ ] 墙头仙人掌 — 墙头仙人掌特写 + 它开花的样子
- [ ] 猫猫们 — 院里那只猫睡觉/晒毛的瞬间
- [ ] 葡萄藤 — 葡萄架下绿荫 + 葡萄串熟透的特写
- [ ] 菜地 — 菜地全景/排排菜苗 + 姥姥弯腰摘菜的背影
- [ ] 老院门 — 老院门旧址/门框 + 院子还没扩大时的全景
- [ ] 压水井 — 压水井出水/孩子压水的动作
- [ ] 堂屋 — 堂屋门口/门帘 + 屋里家具的角落照
- [ ] 月季 — 月季花丛盛开的特写 + 摘花/花沿枝头的照片

**没有照片怎么办？** 记忆卡对「缺照片」有兜底——`hotspots.json` 里没写 `photo` 字段时，记忆卡自动不渲染图片区域，只显示标题和文字。所以你可以先写回忆文字、后补照片，互不阻塞。

---

## 体积预算（Budgets）

> 当前基线：`npm run build` 后 `dist` 总体积 **0.94 MB**；硬红线 **15 MB**（脚本 `scripts/check-size.mjs` 硬性拦超限，build 不被拦但 `npm run size` 会报红）。

| 类别 | 预算 | 说明 |
|---|---|---|
| 场景基础（现有 dist） | ~0.94MB | 骨架、贴图、代码打包，永远在场 |
| 单个 3D 模型 | ≤ 1MB（glb，draco+webp 压缩后） | 尽量压到 100~500KB 最稳 |
| 12 个物件 + 小人 | 最坏 ~13MB | 若每个都卡上限 1MB，刚好踩线 |
| 12 张照片（WebP） | ~100~300KB × 12 ≈ 2~4MB | cwebp `-q 80` 已是压过 |
| **总红线** | **15 MB** | 超过则 `npm run size` 直接 FAIL |

**守"安全距离"的最佳实践：**
- 每个模型都往「远低于 1MB」做——三角面减到 ≤ 2k、贴图 1024 及以下、尽可能 draco+webp 全开。
- 猫/月季/仙人掌这类小物件理应只有 100~300KB；枣树、大门这种大物件撑到 400~700KB 无妨。
- **每放进一个新模型就立刻** `npm run build && npm run size`，看着总数字增长，别等最后一起验。
- 若总包逼近红线：先砍纹理分辨率，再砍三角面；实在不行，把某几个倒影光线阴影柱换成非 shadow 版本（省 GPU 也省 bundle 里的着色器开销）。

> **估算锚点**：12 个物件 + 小人 = 13 个 glb。按每个 300~500KB 估，约 4~6.5MB + 现有 0.94MB + 照片 2~4MB ≈ **7~11MB**，稳在 15MB 红线内。只有全部堆到 1MB 上限才危险。

---

## 替换落地 Checklist（每次换一个物件走一遍）

1. Tripo 导出 → `npx gltf-transform optimize in.glb assets/models/<id>.glb --compress draco --texture-compress webp`
2. 确认文件 ≤ 1MB（`ls -lh assets/models/<id>.glb`）
3. 组件里 `<Capsule>/<Sphere>/<Box>` → `<useGLTF>`，按「目标尺寸」列缩放摆正
4. 确认动效挂钩还在（`useHotspotAnim` 的 `anim` 仍能驱动该物件 children[0]）
5. `npm run validate`（内容校验）+ `npm run build && npm run size`（体积）+ `npm test`（19/19）
6. commit