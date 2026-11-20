import bounds from '../content/assetBounds.json';
import type { HotspotId } from '../content/types';

export function AssetPlaceholder({ path, hotspotId, fitHeight, fitWidth, position = [0,0,0], rotation = [0,0,0] }: {
  path: string; hotspotId?: HotspotId; fitHeight?: number; fitWidth?: number;
  position?: readonly [number,number,number]; rotation?: readonly [number,number,number];
}) {
  const name = path.split('/').pop()!.split('?')[0];
  const size = bounds[name as keyof typeof bounds] ?? [1,1,1];
  const scale = fitHeight ? fitHeight / size[1] : 1;
  const [w,h,d] = [fitWidth ?? size[0]*scale, size[1]*scale, size[2]*scale];
  const box = (key: string, x: number, y: number, z: number, width: number, height: number, depth: number, color: string) => (
    <mesh key={key} position={[x,y,z]} userData={{hotspotId}}>
      <boxGeometry args={[width,height,depth]} /><meshLambertMaterial color={color} />
    </mesh>
  );
  let content;
  if (name.includes('gate') || name.includes('pergola')) {
    // Leave the opening empty: a solid placeholder would hide a walkable path.
    content = <>
      {box('left',-w*.44,h*.45,0,w*.12,h*.9,d,'#79573d')}
      {box('right',w*.44,h*.45,0,w*.12,h*.9,d,'#79573d')}
      {box('roof',0,h*.94,0,w,h*.12,d,'#70523f')}
    </>;
  } else if (name.includes('house')) {
    content = <>{box('body',0,h*.42,0,w,h*.84,d,'#ba9e7b')}
      {box('roof',0,h*.92,0,w*1.04,h*.16,d*1.04,'#89523f')}
      {box('door',0,h*.23,d*.505,w*.18,h*.46,.03,'#6e4932')}</>;
  } else if (/chair|bench|stool/.test(name)) {
    content = <>{box('seat',0,h*.38,0,w,h*.15,d,'#8a623e')}
      {box('leg1',-w*.35,h*.17,0,w*.12,h*.34,d*.8,'#745336')}
      {box('leg2',w*.35,h*.17,0,w*.12,h*.34,d*.8,'#745336')}
      {box('back',0,h*.73,-d*.4,w,h*.54,d*.12,'#8a623e')}</>;
  } else if (/plant|choy|cactus|rose|tree/.test(name)) {
    content = <mesh position={[0,h*.5,0]} scale={[w/2,h/2,d/2]} userData={{hotspotId}}>
      <icosahedronGeometry args={[1,0]} /><meshLambertMaterial color="#638144" />
    </mesh>;
  } else {
    content = box('body',0,h/2,0,w,h,d,/cat/.test(name)?'#9a8974':'#8b8275');
  }
  return <group name={`placeholder:${name}`} position={position} rotation={[...rotation]} userData={{hotspotId}}>{content}</group>;
}
