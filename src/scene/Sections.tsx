export default function Sections() {
  return (
    <group>
      {/* 后院：堂屋（北墙前）+ 月季×2 + 压水井占位 */}
      <mesh position={[-3, 1.5, -15]} castShadow>
        <boxGeometry args={[10, 3, 5]} />
        <meshLambertMaterial color="#8a6f52" />
      </mesh>
      <mesh position={[-5, 0.4, -8]} castShadow><boxGeometry args={[0.8, 0.8, 0.8]} /><meshLambertMaterial color="#6b8e23" /></mesh>
      <mesh position={[5, 0.4, -8]} castShadow><boxGeometry args={[0.8, 0.8, 0.8]} /><meshLambertMaterial color="#6b8e23" /></mesh>
      <mesh position={[3, 0.6, -11]} castShadow><cylinderGeometry args={[0.4, 0.4, 1.2, 12]} /><meshLambertMaterial color="#5a5a5a" /></mesh>

      {/* 廊亭：旧门（两柱一梁）+ 围墙 + 葡萄藤架 + 菜地 */}
      <mesh position={[-6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[6, 1.5, -2]} castShadow><boxGeometry args={[0.4, 3, 0.4]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 3.1, -2]} castShadow><boxGeometry args={[12.4, 0.4, 1.2]} /><meshLambertMaterial color="#8a6f52" /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[10, 2.2, 0.3]} /><meshLambertMaterial color="#a8998a" /></mesh>
      <mesh position={[0, 2.2, 0]} castShadow><boxGeometry args={[8, 0.3, 3]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
      <mesh position={[6, 0.25, 2]} rotation-y={Math.PI / 2} castShadow><boxGeometry args={[3, 0.5, 1.6]} /><meshLambertMaterial color="#5f7a3d" /></mesh>

      {/* 前院：新房×2 + 枣树占位 */}
      <mesh position={[-7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
      <mesh position={[7, 1.8, 13]} castShadow><boxGeometry args={[7, 3.6, 6]} /><meshLambertMaterial color="#c8c8c8" /></mesh>
      <mesh position={[-3, 1.5, 8]} castShadow><cylinderGeometry args={[0.3, 0.4, 3, 8]} /><meshLambertMaterial color="#6b4f2f" /></mesh>
      <mesh position={[-3, 3.4, 8]} castShadow><sphereGeometry args={[1.6, 12, 10]} /><meshLambertMaterial color="#4a7a2e" /></mesh>

      {/* 新大门（门洞处两扇门板，先静态） */}
      <mesh position={[-0.5, 1, 18]} castShadow><boxGeometry args={[1, 2, 0.12]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
      <mesh position={[0.5, 1, 18]} castShadow><boxGeometry args={[1, 2, 0.12]} /><meshLambertMaterial color="#7a5c3e" /></mesh>
    </group>
  );
}