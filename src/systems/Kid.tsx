import { useRef, useMemo } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { ASSET_PATHS } from '../content/assets';
import { stepToward, resolveCollision } from './movement';
import { getObstacles } from './obstacles';
import { stripHorizontalRootMotion } from './characterAnimation';

const SPEED = 1.5; // 米/秒，闲庭信步
const CHARACTER_SCALE = 1.45;
const SEATED_GROUP_Y = 0.5; // 把臀部抬到摇椅坐垫上，避免腿部陷入坐垫

type CharacterAction = 'wait' | 'walk' | 'sit';

function actionName(actions: Record<string, THREE.AnimationAction | null>, name: CharacterAction) {
  return actions[`${name}.001`] ?? actions[name] ?? null;
}

export default function Kid() {
  const group = useRef<THREE.Group>(null!);
  const modelGroup = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(ASSET_PATHS.character);
  const animationClips = useMemo(
    () => animations.map((clip) => stripHorizontalRootMotion(clip, clip.name === 'sit.001')),
    [animations],
  );
  const { actions } = useAnimations(animationClips, modelGroup);
  const activeActionRef = useRef<CharacterAction | null>(null);
  const movementActionRef = useRef<CharacterAction | null>(null);
  const posRef = useRef({ x: 0, z: 19.2 });
  const yawRef = useRef(Math.PI); // 面朝北（-z，进院方向）
  const tRef = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05); // 切后台回来防跳变
    const g = useGame.getState();
    const t = tRef.current += dt;
    if (!g.target) {
      movementActionRef.current = null;
    } else if (!movementActionRef.current) {
      movementActionRef.current = 'walk';
    }
    const nextAction: CharacterAction = g.seated
      ? 'sit'
      : g.target
        ? movementActionRef.current ?? 'walk'
        : 'wait';
    if (activeActionRef.current !== nextAction) {
      const previous = activeActionRef.current ? actionName(actions, activeActionRef.current) : null;
      const next = actionName(actions, nextAction);
      previous?.fadeOut(0.15);
      if (next) {
        next.reset();
        next.setLoop(nextAction === 'sit' ? THREE.LoopOnce : THREE.LoopRepeat, nextAction === 'sit' ? 1 : Infinity);
        next.clampWhenFinished = nextAction === 'sit';
        next.fadeIn(0.15).play();
      }
      activeActionRef.current = nextAction;
    }

    if (g.target && g.phase !== 'title') {
      const { x, z, reached } = stepToward(posRef.current, g.target, SPEED, dt);
      const solved = resolveCollision(x, z, getObstacles(g.gateOpen));
      posRef.current = solved;
      // 每帧把位置写进 store，FollowCamera 用 getState() 非响应式读取，避免重渲染风暴
      useGame.getState().setKidPos({ x: solved.x, z: solved.z });
      // 朝向移动方向
      const dx = g.target.x - solved.x, dz = g.target.z - solved.z;
      if (Math.hypot(dx, dz) > 0.05) {
        yawRef.current = Math.atan2(dx, dz);
      }
      if (reached) {
        g.setTarget(null);
        if (g.pendingHotspot) {
          const id = g.pendingHotspot;
          g.setPendingHotspot(null);
          if (id === 'rocking-chair') {
            posRef.current = { x: 0.5, z: 1.25 };
            yawRef.current = 0; // 坐下后背靠椅背，面朝院外（南侧）
            g.setKidPos(posRef.current);
            g.setSeated(true);
          } else {
            g.setOpenHotspot(id); // 到达物件 → 打开记忆卡
          }
        }
      }
    } else {
      // 待机：轻微呼吸摇摆
    }

    if (group.current) {
      group.current.position.set(posRef.current.x, 0, posRef.current.z);
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, yawRef.current, Math.min(1, dt * 10),
      );
      const bob = g.target ? Math.abs(Math.sin(t * 8)) * 0.06 : Math.sin(t * 2) * 0.01;
      group.current.position.y = (g.seated ? SEATED_GROUP_Y : 0) + bob;
    }
  });

  return (
    <group ref={group} position={[0, 0, 19.2]}>
      <group ref={modelGroup}>
        <primitive object={scene} scale={CHARACTER_SCALE} />
      </group>
    </group>
  );
}
