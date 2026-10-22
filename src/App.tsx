import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Ground from './scene/Ground';
import Boundary from './scene/Boundary';
import Lighting from './scene/Lighting';
import Sections from './scene/Sections';
import HotspotRegistry from './scene/hotspot-props/HotspotRegistry';
import ClickToMove from './systems/ClickToMove';
import Kid from './systems/Kid';
import FollowCamera from './systems/FollowCamera';
import IntroSequence from './systems/IntroSequence';
import AmbientLife from './systems/AmbientLife';
import PerformanceGuard from './systems/PerformanceGuard';
import KeyboardMove from './systems/KeyboardMove';
import MemoryCard from './ui/MemoryCard';
import TitleScreen from './ui/TitleScreen';
import LoadingHint from './ui/LoadingHint';

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 4, 21], fov: 50 }}
        style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
        onCreated={() => setReady(true)}
      >
        <color attach="background" args={['#87ceeb']} />
        <Lighting />
        <ClickToMove onGroundClick={(p) => console.log('[move]', p)}>
          <Ground />
          <Boundary />
          <Sections />
          <HotspotRegistry />
        </ClickToMove>
        <Kid />
        <FollowCamera />
        <IntroSequence />
        <KeyboardMove />
        <AmbientLife />
        <PerformanceGuard />
      </Canvas>
      <MemoryCard />
      <TitleScreen />
      {!ready && <LoadingHint />}
    </>
  );
}