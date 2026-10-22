import { Canvas } from '@react-three/fiber';
import Ground from './scene/Ground';
import Boundary from './scene/Boundary';
import Lighting from './scene/Lighting';
import Sections from './scene/Sections';
import ClickToMove from './systems/ClickToMove';

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 8, 26], fov: 50 }}
      style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
    >
      <color attach="background" args={['#87ceeb']} />
      <Lighting />
      <Ground />
      <Boundary />
      <Sections />
      <ClickToMove onGroundClick={(p) => console.log('[move]', p)} />
    </Canvas>
  );
}