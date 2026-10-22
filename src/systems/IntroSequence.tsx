import { useFrame } from '@react-three/fiber';
import { useGame } from '../app/store';
import { useRef } from 'react';

const WAYPOINTS: ReadonlyArray<{ x: number; z: number }> = [
  { x: 0, z: 14 }, { x: 0, z: 7 }, { x: 0, z: 1 },
];

export default function IntroSequence() {
  const wp = useRef(0);
  useFrame(() => {
    const g = useGame.getState();
    if (g.phase !== 'intro') return;
    if (!g.target) {
      if (wp.current < WAYPOINTS.length) {
        g.setTarget({ ...WAYPOINTS[wp.current] });
        wp.current += 1;
      } else {
        g.setPhase('play');
      }
    }
  });
  return null;
}