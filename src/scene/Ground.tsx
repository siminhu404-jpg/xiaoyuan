import { SECTIONS } from './layout';

export default function Ground() {
  const colors = { backyard: '#a8b57c', corridor: '#c2b280', frontyard: '#b5c99a' };
  return (
    <group>
      {(Object.keys(SECTIONS) as Array<keyof typeof SECTIONS>).map((key) => {
        const s = SECTIONS[key];
        const zCenter = (s.zMin + s.zMax) / 2;
        const depth = s.zMax - s.zMin;
        return (
          <mesh key={key} rotation-x={-Math.PI / 2} position={[0, 0, zCenter]} receiveShadow>
            <planeGeometry args={[24, depth]} />
            <meshLambertMaterial color={colors[key]} />
          </mesh>
        );
      })}
    </group>
  );
}