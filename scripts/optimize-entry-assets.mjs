import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, simplify, textureCompress, weld } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

// Always read the original assets from this published revision, never simplify
// the previous output again. Original models remain recoverable in Git history.
const sourceRevision = '34001a471cd00f6b1e2b7de6158a5acb256e7a46';
const plans = [
  { name: 'outer-gate-door', ratio: 0.2, error: 0.001, texture: 1024 },
  { name: 'outer-gate-right-door', ratio: 0.2, error: 0.001, texture: 1024 },
  { name: 'modern-house', ratio: 0.2, error: 0.001, texture: 1024 },
  { name: 'jujube-tree', ratio: 0.3, error: 0.001, texture: 1024 },
  { name: 'character-with-animations', texture: 1024 },
];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
});
await MeshoptSimplifier.ready;
const triangles = (doc) => doc.getRoot().listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((n, p) => n + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0), 0);
const report = [];
for (const plan of plans) {
  const path = `public/assets/${plan.name}.glb`;
  const source = execFileSync('git', ['show', `${sourceRevision}:${path}`], { maxBuffer: 32 * 1024 * 1024 });
  const document = await io.readBinary(new Uint8Array(source));
  const beforeTriangles = triangles(document);
  const texturesBefore = document.getRoot().listTextures().map((texture) => texture.getSize());
  const animationNames = document.getRoot().listAnimations().map((animation) => animation.getName());
  if (plan.ratio) await document.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: plan.ratio, error: plan.error }));
  // JPEG retains broad WebGL/browser support. No new runtime decoder required.
  await document.transform(textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [plan.texture, plan.texture], quality: 82 }), dedup(), draco());
  const output = await io.writeBinary(document);
  // Decode our own output to catch corrupt compression and lost animations.
  const verified = await io.readBinary(output);
  if (JSON.stringify(verified.getRoot().listAnimations().map((a) => a.getName())) !== JSON.stringify(animationNames)) throw new Error(`${plan.name}: animation names changed`);
  await writeFile(path, output);
  report.push({ name: plan.name, beforeBytes: source.length, afterBytes: output.length, beforeTriangles, afterTriangles: triangles(verified), texturesBefore, texturesAfter: verified.getRoot().listTextures().map((t) => t.getSize()), animations: animationNames });
  console.log(JSON.stringify(report.at(-1)));
}
await mkdir('docs/performance', { recursive: true });
await writeFile('docs/performance/entry-assets.json', JSON.stringify({ sourceRevision, models: report }, null, 2) + '\n');
