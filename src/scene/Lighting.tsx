export const LIGHTING_STYLE = {
  ambientIntensity: 0.46,
  hemisphereIntensity: 0.34,
  hemisphereSkyColor: '#f0d9bd',
  hemisphereGroundColor: '#806957',
  sunPosition: [-10, 16, 8] as const,
  sunIntensity: 1.25,
  sunColor: '#f6c58f',
  shadowMapSize: 2048,
  shadowCamera: {
    left: -24,
    right: 24,
    top: 24,
    bottom: -24,
    near: 1,
    far: 48,
  },
} as const;

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={LIGHTING_STYLE.ambientIntensity} color="#f4e5d4" />
      <hemisphereLight
        args={[
          LIGHTING_STYLE.hemisphereSkyColor,
          LIGHTING_STYLE.hemisphereGroundColor,
          LIGHTING_STYLE.hemisphereIntensity,
        ]}
      />
      <directionalLight
        castShadow
        position={LIGHTING_STYLE.sunPosition}
        intensity={LIGHTING_STYLE.sunIntensity}
        color={LIGHTING_STYLE.sunColor}
        shadow-mapSize={[LIGHTING_STYLE.shadowMapSize, LIGHTING_STYLE.shadowMapSize]}
        shadow-camera-left={LIGHTING_STYLE.shadowCamera.left}
        shadow-camera-right={LIGHTING_STYLE.shadowCamera.right}
        shadow-camera-top={LIGHTING_STYLE.shadowCamera.top}
        shadow-camera-bottom={LIGHTING_STYLE.shadowCamera.bottom}
        shadow-camera-near={LIGHTING_STYLE.shadowCamera.near}
        shadow-camera-far={LIGHTING_STYLE.shadowCamera.far}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      />
    </>
  );
}
