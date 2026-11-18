import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { softenAssetColor, styleMaterial } from './ImportedAsset';

describe('正式资产材质风格', () => {
  it('降低高饱和材质并保留原有色相', () => {
    const original = new THREE.Color('#d94a2b');
    const softened = softenAssetColor(original);
    const originalHsl = { h: 0, s: 0, l: 0 };
    const softenedHsl = { h: 0, s: 0, l: 0 };
    original.getHSL(originalHsl);
    softened.getHSL(softenedHsl);

    expect(softenedHsl.h).toBeCloseTo(originalHsl.h, 2);
    expect(softenedHsl.s).toBeLessThan(originalHsl.s);
    expect(softenedHsl.l).toBeGreaterThan(originalHsl.l);
  });

  it('建筑风格进一步压低屋顶和墙面资产的饱和度', () => {
    const original = new THREE.MeshStandardMaterial({ color: '#d54c32' });
    const styled = styleMaterial(original, 'building') as THREE.MeshStandardMaterial;
    const originalHsl = { h: 0, s: 0, l: 0 };
    const styledHsl = { h: 0, s: 0, l: 0 };
    original.color.getHSL(originalHsl);
    styled.color.getHSL(styledHsl);

    expect(styledHsl.s).toBeLessThanOrEqual(originalHsl.s * 0.52);
    expect(styledHsl.l).toBeGreaterThan(originalHsl.l);
  });

  it('复制材质并压低塑料高光，不修改原材质', () => {
    const original = new THREE.MeshStandardMaterial({
      color: '#b94f32',
      roughness: 0.18,
      metalness: 0.35,
    });

    const styled = styleMaterial(original, 'courtyard') as THREE.MeshStandardMaterial;

    expect(styled).not.toBe(original);
    expect(styled.roughness).toBeGreaterThanOrEqual(0.78);
    expect(styled.metalness).toBe(0);
    expect(original.roughness).toBe(0.18);
    expect(original.metalness).toBe(0.35);
  });

  it('植物风格保留绿色但进一步降低饱和度', () => {
    const original = new THREE.MeshStandardMaterial({ color: '#42b84a' });
    const styled = styleMaterial(original, 'plant') as THREE.MeshStandardMaterial;
    const hsl = { h: 0, s: 0, l: 0 };
    styled.color.getHSL(hsl);

    expect(hsl.h).toBeCloseTo(original.color.getHSL({ h: 0, s: 0, l: 0 }).h, 2);
    expect(hsl.s).toBeLessThan(original.color.getHSL({ h: 0, s: 0, l: 0 }).s);
  });
});
