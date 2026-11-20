import { Suspense } from 'react';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';
import CourtyardProps from './CourtyardProps';
import { useLoadedAssetZones } from '../assetZones';

export default function HotspotRegistry() {
  const { frontyard, corridor, backyard } = useLoadedAssetZones();

  return (
    <>
      {frontyard && (
        <>
          <Suspense fallback={null}><JujubeTree /></Suspense>
          <Suspense fallback={null}><FrontyardProps /></Suspense>
        </>
      )}
      {corridor && (
        <>
          <Suspense fallback={null}><Cats /></Suspense>
          <Suspense fallback={null}><CorridorProps /></Suspense>
        </>
      )}
      {backyard && (
        <>
          <Suspense fallback={null}><Roses /></Suspense>
          <Suspense fallback={null}><BackyardProps /></Suspense>
          <Suspense fallback={null}><CourtyardProps /></Suspense>
        </>
      )}
    </>
  );
}
