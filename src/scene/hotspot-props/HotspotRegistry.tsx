import { Suspense } from 'react';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';
import CourtyardProps from './CourtyardProps';

// All places exist immediately. ImportedAsset owns each model's fallback and
// loading boundary, so a slow cabbage cannot hide the gate or the whole garden.
export default function HotspotRegistry() {
  return <>
    <Suspense fallback={null}><JujubeTree /></Suspense>
    <FrontyardProps />
    <Cats />
    <CorridorProps />
    <Roses />
    <BackyardProps />
    <CourtyardProps />
  </>;
}
