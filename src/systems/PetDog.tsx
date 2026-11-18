import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinnedScene } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useGame } from '../app/store';
import { resolveCollision } from './movement';
import { OBSTACLES } from './obstacles';
import { ASSET_PATHS } from '../content/assets';
import { softenAssetColor } from '../scene/ImportedAsset';

const DOG_WALK_ANIMATION = 'preset:quadruped:walk';

export function stripRootMotion(clip: THREE.AnimationClip) {
  const stripped = clip.clone();
  stripped.tracks = stripped.tracks.filter(
    (track) => !track.name.startsWith('tripo::Root.position'),
  );
  return stripped;
}

const FOLLOW_MIN = 1.8;
const RUN_DIST = 4;
const SPEED_WALK = 2.6;
const SPEED_RUN = 3.4;
const STOP_SLACK = 1.1;

/** 边牧「小黑」：跟随小人的宠物狗，沿用原有跟随和碰撞逻辑。 */
export default function PetDog() {
  const g = useRef<THREE.Group>(null!);
  const pos = useRef({ x: 0.9, z: 18 });
  const yaw = useRef(Math.PI);
  const t = useRef(0);
  const wasMoving = useRef(false);
  const { scene, animations } = useGLTF(ASSET_PATHS.borderCollie, true);
  const model = useMemo(() => {
    const clone = cloneSkinnedScene(scene) as THREE.Group;
    clone.traverse((object) => {
      if (!('isMesh' in object) || !object.isMesh) return;
      const mesh = object as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => {
          const softened = material.clone();
          if ('color' in softened && softened.color instanceof THREE.Color) {
            softened.color.copy(softenAssetColor(softened.color));
          }
          return softened;
        });
      } else {
        const softened = mesh.material.clone();
        if ('color' in softened && softened.color instanceof THREE.Color) {
          softened.color.copy(softenAssetColor(softened.color));
        }
        mesh.material = softened;
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const height = bounds.getSize(new THREE.Vector3()).y;
    if (height > 0) clone.scale.setScalar(0.85 / height);
    const after = new THREE.Box3().setFromObject(clone);
    clone.position.y -= after.min.y;
    return clone;
  }, [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model]);
  const walkAction = useMemo(() => {
    const clip = THREE.AnimationClip.findByName(animations, DOG_WALK_ANIMATION) ?? animations[0];
    return clip ? mixer.clipAction(stripRootMotion(clip)) : null;
  }, [animations, mixer]);

  useEffect(() => {
    if (!walkAction) return;
    walkAction.reset().play();
    walkAction.paused = true;
    return () => {
      walkAction.stop();
    };
  }, [walkAction]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = useGame.getState();
    const t2 = t.current += dt;
    if (!g.current) return;

    let hx = s.kidPos.x;
    let hz = s.kidPos.z;
    if (s.target) {
      const dx = s.target.x - s.kidPos.x;
      const dz = s.target.z - s.kidPos.z;
      const len = Math.hypot(dx, dz);
      if (len > 0.05) {
        hx = s.kidPos.x - (dx / len) * 0.9;
        hz = s.kidPos.z - (dz / len) * 0.9;
      }
    }

    const dx = hx - pos.current.x;
    const dz = hz - pos.current.z;
    const dist = Math.hypot(dx, dz);
    let moving = false;
    if (dist > FOLLOW_MIN) {
      const speed = dist > RUN_DIST ? SPEED_RUN : SPEED_WALK;
      const step = Math.min(speed * dt, dist);
      pos.current = resolveCollision(
        pos.current.x + (dx / dist) * step,
        pos.current.z + (dz / dist) * step,
        OBSTACLES,
      );
      yaw.current = Math.atan2(dx, dz);
      moving = true;
    } else if (dist > STOP_SLACK) {
      const step = Math.min(0.8 * dt, dist - STOP_SLACK);
      pos.current = resolveCollision(
        pos.current.x + (dx / dist) * step,
        pos.current.z + (dz / dist) * step,
        OBSTACLES,
      );
      yaw.current = Math.atan2(dx, dz);
      moving = true;
    }

    if (walkAction) {
      if (moving !== wasMoving.current) {
        wasMoving.current = moving;
        walkAction.paused = !moving;
        if (moving) walkAction.reset().play();
      }
      mixer.update(moving ? dt : 0);
    }

    g.current.position.set(pos.current.x, moving ? Math.abs(Math.sin(t2 * 10)) * 0.05 : Math.sin(t2 * 2) * 0.008, pos.current.z);
    g.current.rotation.y = THREE.MathUtils.lerp(
      g.current.rotation.y,
      yaw.current,
      Math.min(1, dt * 10),
    );
  });

  return (
    <group ref={g} position={[0.9, 0, 18]}>
      <primitive object={model} />
    </group>
  );
}
