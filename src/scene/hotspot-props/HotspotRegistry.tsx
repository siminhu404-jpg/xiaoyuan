import Gate from './Gate';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';

export default function HotspotRegistry() {
  return (
    <>
      <Gate />
      <JujubeTree />
      <Roses />
      <Cats />
      <CorridorProps />
      <BackyardProps />
      <FrontyardProps />
    </>
  );
}