import { useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Boundary from './scene/Boundary';
import Lighting from './scene/Lighting';
import Sections from './scene/Sections';
import HotspotRegistry from './scene/hotspot-props/HotspotRegistry';
import ClickToMove from './systems/ClickToMove';
import Kid from './systems/Kid';
import PetDog from './systems/PetDog';
import FollowCamera from './systems/FollowCamera';
import IntroSequence from './systems/IntroSequence';
import AmbientLife from './systems/AmbientLife';
import PerformanceGuard from './systems/PerformanceGuard';
import KeyboardMove from './systems/KeyboardMove';
import MemoryCard from './ui/MemoryCard';
import TitleScreen from './ui/TitleScreen';
import Gate from './scene/hotspot-props/Gate';
import { useGame } from './app/store';
import StartupBoundary from './ui/StartupBoundary';
import { GRAYBOX_CAMERA } from './scene/layout';
import { useAssetStreaming } from './scene/assetStreaming';

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export default function App() {
  return <StartupBoundary><Courtyard /></StartupBoundary>;
}

function Courtyard() {
  const [ready, setReady] = useState(false);
  const [kidReady, setKidReady] = useState(false);
  const [gateReady, setGateReady] = useState(false);
  const onKidReady = useCallback(() => setKidReady(true), []);
  const onGateReady = useCallback(() => setGateReady(true), []);
  const playing = useGame((state) => state.phase !== 'title');
  useEffect(() => {
    if (ready && kidReady && gateReady) useAssetStreaming.getState().start();
  }, [ready, kidReady, gateReady]);
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, GRAYBOX_CAMERA.height, 25], fov: GRAYBOX_CAMERA.fov }}
        style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.95;
          setReady(true);
        }}
      >
        <color attach="background" args={['#d7c5ad']} />
        <Lighting />
        <ClickToMove onGroundClick={(p) => console.log('[move]', p)}>
          <Boundary />
          <Suspense fallback={null}>
            <Gate />
            <Ready onReady={onGateReady} />
          </Suspense>
          <Suspense fallback={null}>
            <Sections />
          </Suspense>
          <Suspense fallback={null}>
            <HotspotRegistry />
          </Suspense>
        </ClickToMove>
        <Suspense fallback={null}>
          <Kid />
          <Ready onReady={onKidReady} />
        </Suspense>
        {playing && <Suspense fallback={null}><PetDog /></Suspense>}
        <FollowCamera />
        <IntroSequence />
        <KeyboardMove />
        {playing && <Suspense fallback={null}><AmbientLife /></Suspense>}
        <PerformanceGuard />
      </Canvas>
      <MemoryCard />
      <TitleScreen ready={ready && kidReady && gateReady} />
    </>
  );
}