import { useEffect, useState } from 'react';
import Gate from './Gate';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';
import CourtyardProps from './CourtyardProps';

export default function HotspotRegistry() {
  const [deferredReady, setDeferredReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDeferredReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Gate />
      <JujubeTree />
      <Roses />
      <FrontyardProps />
      {deferredReady && (
        <>
          <Cats />
          <CorridorProps />
          <BackyardProps />
          <CourtyardProps />
        </>
      )}
    </>
  );
}
