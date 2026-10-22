import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';

if (!existsSync(dist)) {
  console.error('✗ 未找到 dist/ 目录，先运行 npm run build');
  process.exit(1);
}

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