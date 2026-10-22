export default function Sections() {
  return (
    <group>
      {/* 后院：堂屋（北墙前）——结构性体块；月季/压水井已由 hotspot 组件提供 */}
      <mesh position={[-3, 1.5, -15]} castShadow>
        <boxGeometry args={[10, 3, 5]} />
        <meshLambertMaterial color="#8a6f52" />
      </mesh>

      {/* 廊亭：两柱一梁 + 围墙 + 廊亭屋顶 + 菜地土箱（结构）；老院门/仙人掌/葡萄藤/菜地作物由 hotspot 组件提供 */}
      <mesh position={[-6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 3.1, -2]} castShadow><boxGeometry args={[12.4, 0.4, 1.2]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[10, 2.2, 0.3]} /><meshLambertMaterial color="#a8998a" /></mesh>
      <mesh position={[0, 2.2, 0]} castShadow><boxGeometry args={[8, 0.3, 3]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
      <mesh position={[6, 0.25, 2]} rotation-y={Math.PI / 2} castShadow><boxGeometry args={[3, 0.5, 1.6]} /><meshLambertMaterial color="#5f7a3d" /></mesh>

      {/* 前院：新房×2 体块（结构）；枣树/大门由 hotspot 组件提供 */}
      <mesh position={[-7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
      <mesh position={[7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
    </group>
  );
}