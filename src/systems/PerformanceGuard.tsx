import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../app/store';

const SAMPLE_WINDOW = 120; // 帧
const SLOW_MS = 40;        // 单帧阈值（>40ms ≈ <25fps）
const WARMUP_FRAMES = 10;  // 跳过场景初始化卡顿，避免误触发永久降级

export default function PerformanceGuard() {
  const { gl } = useThree();

  const slowRef = useRef(0);
  const totalRef = useRef(0);
  const warmupRef = useRef(0);

  useFrame((_, dt) => {
    const g = useGame.getState();
    if (g.lowPerf) return; // 已降级，不再监控

    // 场景初始化阶段的首帧 dt 可能异常偏大，先跳过前若干帧
    if (warmupRef.current < WARMUP_FRAMES) {
      warmupRef.current++;
      return;
    }

    totalRef.current++;
    if (dt * 1000 > SLOW_MS) slowRef.current++;

    if (totalRef.current >= SAMPLE_WINDOW && slowRef.current / totalRef.current > 0.5) {
      gl.setPixelRatio(1); // DPR 封顶
      g.enableLowPerf();   // 环境粒子减半
    }
  });

  return null;
}