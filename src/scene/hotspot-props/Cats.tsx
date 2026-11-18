import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../app/store';
import { ASSET_PATHS } from '../../content/assets';
import { CAT_WANDER_BOUNDS, LANDMARKS } from '../layout';
import { ImportedAsset } from '../ImportedAsset';

const CAT_BASE_Y = 0.05;

type CatAsset = {
  path: string;
  offset: [number, number, number];
  fitHeight: number;
  phase: number;
};

function Cat({ path, offset, fitHeight, phase }: CatAsset) {
  const g = useRef<THREE.Group>(null!);
  const target = useRef<[number, number]>([offset[0], offset[2]]);
  const nextTargetAt = useRef(phase);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const active = useGame.getState().openHotspot === 'cats';
    if (!g.current) return;

    if (t >= nextTargetAt.current) {
      target.current = [
        CAT_WANDER_BOUNDS.minX +
          ((Math.sin(t * 0.83 + phase) + 1) / 2) *
            (CAT_WANDER_BOUNDS.maxX - CAT_WANDER_BOUNDS.minX),
        CAT_WANDER_BOUNDS.minZ +
          ((Math.cos(t * 0.71 + phase) + 1) / 2) *
            (CAT_WANDER_BOUNDS.maxZ - CAT_WANDER_BOUNDS.minZ),
      ];
      nextTargetAt.current = t + 2.8 + ((phase * 10) % 1.5);
    }

    const dx = target.current[0] - g.current.position.x;
    const dz = target.current[1] - g.current.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.05) {
      const step = Math.min(distance, delta * 0.45);
      g.current.position.x += (dx / distance) * step;
      g.current.position.z += (dz / distance) * step;
      g.current.rotation.y = Math.atan2(dx, dz);
    }

    const breathe = Math.sin(t * 1.8 + phase) * 0.015;
    const hop = active ? Math.max(0, Math.sin(t * 6)) * 0.1 : 0;
    g.current.position.y = CAT_BASE_Y + breathe + hop;
  });

  return (
    <group ref={g} position={offset} userData={{ hotspotId: 'cats' }}>
      <ImportedAsset path={path} hotspotId="cats" fitHeight={fitHeight} />
    </group>
  );
}

export default function Cats() {
  const cats: CatAsset[] = [
    { path: ASSET_PATHS.threeColorCat, offset: [0, 0, 0], fitHeight: 0.55, phase: 0.2 },
    { path: ASSET_PATHS.blackCat, offset: [0.8, 0, 0.5], fitHeight: 0.55, phase: 1.7 },
    { path: ASSET_PATHS.whiteCat, offset: [-0.7, 0, 0.6], fitHeight: 0.55, phase: 3.1 },
  ];

  return (
    <group position={[LANDMARKS.cats[0], 0, LANDMARKS.cats[1]]}>
      {cats.map((cat) => (
        <Cat key={cat.path} {...cat} />
      ))}
    </group>
  );
}
