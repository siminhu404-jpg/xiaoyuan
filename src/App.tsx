import { useState, Suspense } from 'react';
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
import LoadingHint from './ui/LoadingHint';
import { GRAYBOX_CAMERA } from './scene/layout';
import { AssetPrefetcher } from './scene/assetZones';

export default function App() {
  const [ready, setReady] = useState(false);
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
            <Sections />
          </Suspense>
          <Suspense fallback={null}>
            <HotspotRegistry />
          </Suspense>
        </ClickToMove>
        <AssetPrefetcher />
        <Kid />
        <PetDog />
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