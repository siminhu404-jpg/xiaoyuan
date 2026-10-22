import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 6, 24], fov: 50 }}
      style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
    >
      <color attach="background" args={['#87ceeb']} />
      <ambientLight intensity={0.8} />
    </Canvas>
  );
}