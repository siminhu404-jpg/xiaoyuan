export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#bfd9ff', '#7a8450', 0.6]} />
      <directionalLight position={[8, 14, 10]} intensity={1.2} color="#ffe8c0" />
    </>
  );
}