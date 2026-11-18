import { useMemo } from 'react';
import * as THREE from 'three';

export const COURTYARD_SURFACE_STYLE = {
  surfaceMode: 'flat-texture',
  paverWidth: 0.92,
  paverDepth: 0.58,
  paverHeight: 0.02,
  rowSpacing: 0.64,
  textureRepeat: [5, 8] as const,
  grout: '#a99079',
  paverTones: ['#b99478', '#c3a384', '#ad8b70', '#bea080', '#a98a70'],
} as const;

const TILE_SIZE = 256;
const TILE_WIDTH = 66;
const TILE_HEIGHT = 38;
const TILE_GAP = 2;

export function getPaverToneIndex(row: number, column: number) {
  return (row * 2 + column * 3 + row * column) % COURTYARD_SURFACE_STYLE.paverTones.length;
}

function createCourtyardTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = COURTYARD_SURFACE_STYLE.grout;
  context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

  let row = 0;
  for (let y = -TILE_HEIGHT; y < TILE_SIZE + TILE_HEIGHT; y += TILE_HEIGHT) {
    const offset = row % 2 === 0 ? 0 : TILE_WIDTH / 2;
    let column = 0;
    for (let x = -TILE_WIDTH + offset; x < TILE_SIZE + TILE_WIDTH; x += TILE_WIDTH) {
      const tone = COURTYARD_SURFACE_STYLE.paverTones[getPaverToneIndex(row, column)];
      context.fillStyle = tone;
      context.fillRect(
        x + TILE_GAP / 2,
        y + TILE_GAP / 2,
        TILE_WIDTH - TILE_GAP,
        TILE_HEIGHT - TILE_GAP,
      );
      column += 1;
    }
    row += 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...COURTYARD_SURFACE_STYLE.textureRepeat);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export default function CourtyardSurfaces() {
  const texture = useMemo(createCourtyardTileTexture, []);

  return (
    <mesh
      name="ground"
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 1]}
      receiveShadow
    >
      <planeGeometry args={[24, 38]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color="#fff8ee"
        roughness={0.96}
        metalness={0}
      />
    </mesh>
  );
}
