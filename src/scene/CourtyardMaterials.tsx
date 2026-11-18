import { useMemo } from 'react';
import * as THREE from 'three';

export const WALL_SURFACE_STYLE = {
  background: '#ede1cf',
  grout: '#d9cdbb',
  tileWidth: 28,
  tileHeight: 22,
  lineWidth: 0.7,
  repeatX: 1.2,
  repeatY: 1.4,
} as const;

function createTileTexture({
  background,
  grout,
  tileWidth = 32,
  tileHeight = 20,
  staggered = false,
  repeatX = 1,
  repeatY = 1,
  lineWidth = 1.5,
}: {
  background: string;
  grout: string;
  tileWidth?: number;
  tileHeight?: number;
  staggered?: boolean;
  repeatX?: number;
  repeatY?: number;
  lineWidth?: number;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = grout;
  context.lineWidth = lineWidth;

  for (let y = 0; y <= canvas.height + tileHeight; y += tileHeight) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
  }

  for (let row = 0, y = 0; y <= canvas.height; row += 1, y += tileHeight) {
    const offset = staggered && row % 2 === 1 ? tileWidth / 2 : 0;
    for (let x = -tileWidth + offset; x <= canvas.width + tileWidth; x += tileWidth) {
      context.beginPath();
      context.moveTo(x + 0.5, y);
      context.lineTo(x + 0.5, y + tileHeight);
      context.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return texture;
}

function useTileTexture(options: Parameters<typeof createTileTexture>[0]) {
  const { background, grout, tileWidth, tileHeight, staggered, repeatX, repeatY, lineWidth } = options;
  return useMemo(
    () => createTileTexture({ background, grout, tileWidth, tileHeight, staggered, repeatX, repeatY, lineWidth }),
    [background, grout, tileWidth, tileHeight, staggered, repeatX, repeatY, lineWidth],
  );
}

export function WallBrickMaterial() {
  const texture = useTileTexture(WALL_SURFACE_STYLE);
  return <meshLambertMaterial map={texture ?? undefined} color="#fff8ed" />;
}

export function PlasterWallMaterial() {
  return <meshLambertMaterial color="#d5c3a7" />;
}

export function RedBrickMaterial() {
  const texture = useTileTexture({
    background: '#89564a',
    grout: '#74483f',
    tileWidth: 18,
    tileHeight: 11,
    staggered: true,
    repeatX: 2,
    repeatY: 2,
  });
  return <meshLambertMaterial map={texture ?? undefined} color="#c38b6c" />;
}

export function TerracottaCapMaterial() {
  const texture = useTileTexture({
    background: '#b77a5d',
    grout: '#99604d',
    tileWidth: 20,
    tileHeight: 10,
    staggered: true,
    repeatX: 2,
    repeatY: 2,
  });
  return <meshLambertMaterial map={texture ?? undefined} color="#d09a7d" />;
}
