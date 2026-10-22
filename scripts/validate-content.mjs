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