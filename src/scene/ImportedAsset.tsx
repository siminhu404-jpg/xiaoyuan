import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotId } from '../content/types';
import { assetPath } from '../content/assets';
import { getCenterOffset, getFitWidthScale } from './assetTransform';

type ImportedAssetProps = {
  path: string;
  hotspotId?: HotspotId;
  fitHeight?: number;
  fitWidth?: number;
  centerX?: boolean;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  materialStyle?: MaterialStyle;
};

export type MaterialStyle = 'courtyard' | 'building' | 'plant' | 'wood' | 'roof' | 'neutral';

export function softenAssetColor(color: THREE.Color, style: MaterialStyle = 'courtyard') {
  const softened = color.clone();
  const hsl = { h: 0, s: 0, l: 0 };
  softened.getHSL(hsl);
  const saturation = style === 'plant'
    ? 0.62
    : style === 'building'
      ? 0.5
      : style === 'wood'
        ? 0.64
        : style === 'roof'
          ? 0.56
          : 0.72;
  softened.setHSL(hsl.h, hsl.s * saturation, Math.min(1, hsl.l + (style === 'neutral' ? 0.02 : 0.04)));
  return softened;
}

export function styleMaterial(material: THREE.Material, style: MaterialStyle = 'courtyard') {
  const materialName = material.name.toLowerCase();
  const effectiveStyle: MaterialStyle = style === 'building' && /roof|tile|瓦/.test(materialName)
    ? 'roof'
    : style === 'building' && /wood|door|window|木|门|窗/.test(materialName)
      ? 'wood'
      : style;
  const clone = material.clone() as THREE.Material & {
    color?: THREE.Color;
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
  };

  if (clone.color instanceof THREE.Color) {
    clone.color.copy(softenAssetColor(clone.color, effectiveStyle));
  }
  if (typeof clone.roughness === 'number') {
    const minimumRoughness = effectiveStyle === 'wood' ? 0.86 : effectiveStyle === 'roof' ? 0.9 : 0.82;
    clone.roughness = Math.max(clone.roughness, minimumRoughness);
  }
  if (typeof clone.metalness === 'number') clone.metalness = 0;
  if (typeof clone.envMapIntensity === 'number') clone.envMapIntensity = Math.min(clone.envMapIntensity, 0.35);
  return clone;
}

/** Load a GLB, normalize it to the scene floor, and mark all meshes for interaction/shadows. */
export function ImportedAsset({
  path,
  hotspotId,
  fitHeight,
  fitWidth,
  centerX = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  materialStyle = 'courtyard',
}: ImportedAssetProps) {
  const { scene } = useGLTF(path);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!('isMesh' in object) || !object.isMesh) return;
      const mesh = object as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => styleMaterial(material, materialStyle));
      } else {
        mesh.material = styleMaterial(mesh.material, materialStyle);
      }
      if (hotspotId) mesh.userData.hotspotId = hotspotId;
    });

    if (fitHeight) {
      const before = new THREE.Box3().setFromObject(clone);
      const height = before.getSize(new THREE.Vector3()).y;
      if (height > 0) clone.scale.setScalar(fitHeight / height);
    }

    if (fitWidth) {
      const width = new THREE.Box3().setFromObject(clone).getSize(new THREE.Vector3()).x;
      if (width > 0) clone.scale.x *= getFitWidthScale(width, fitWidth);
    }

    const after = new THREE.Box3().setFromObject(clone);
    clone.position.y -= after.min.y;
    if (centerX) {
      clone.position.x += getCenterOffset(after.min.x, after.max.x);
    }
    return clone;
  }, [centerX, fitHeight, fitWidth, hotspotId, materialStyle, scene]);

  return <primitive object={model} position={position} rotation={rotation} />;
}

useGLTF.preload(assetPath('jujube-tree.glb'));
useGLTF.preload(assetPath('grapevine-pergola.glb'));
useGLTF.preload(assetPath('pump-well.glb'));
useGLTF.preload(assetPath('rose-bush.glb'));
useGLTF.preload(assetPath('cabbage-plant.glb'));
useGLTF.preload(assetPath('inner-courtyard-gate.glb'));
useGLTF.preload(assetPath('outer-gate-door.glb'));
useGLTF.preload(assetPath('outer-gate-right-door.glb'));
useGLTF.preload(assetPath('modern-house.glb'));
useGLTF.preload(assetPath('main-house.glb'));
useGLTF.preload(assetPath('inner-side-house.glb'));
useGLTF.preload(assetPath('rocking-chair.glb'));
useGLTF.preload(assetPath('wall-cactus.glb'));
useGLTF.preload(assetPath('three-color-cat.glb'));
useGLTF.preload(assetPath('black-cat.glb'));
useGLTF.preload(assetPath('white-cat.glb'));
useGLTF.preload(assetPath('butterfly.glb'));
useGLTF.preload(assetPath('border-collie.glb'));
useGLTF.preload(assetPath('tomato-plant.glb'));
useGLTF.preload(assetPath('pepper-plant.glb'));
useGLTF.preload(assetPath('bok-choy.glb'));
useGLTF.preload(assetPath('green-plant.glb'));
useGLTF.preload(assetPath('wooden-bench.glb'));
useGLTF.preload(assetPath('metal-bucket.glb'));
useGLTF.preload(assetPath('wooden-stool.glb'));
useGLTF.preload(assetPath('rural-stone-trough.glb'));
