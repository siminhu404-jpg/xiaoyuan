import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { readdir, writeFile } from 'node:fs/promises';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder': await draco3d.createDecoderModule()});
const bounds = {};
for (const file of (await readdir('public/assets')).filter(f => f.endsWith('.glb')).sort()) {
 const doc = await io.read(`public/assets/${file}`);
 const {min,max} = getBounds(doc.getRoot().listScenes()[0]);
 bounds[file] = max.map((v,i) => Number((v-min[i]).toFixed(5)));
}
await writeFile('src/content/assetBounds.json', JSON.stringify(bounds,null,2)+'\n');
