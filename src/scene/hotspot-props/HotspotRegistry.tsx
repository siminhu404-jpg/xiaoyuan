import Gate from './Gate';
import { JujubeTree, Roses } from './Trees';
import Cats from './Cats';
import CorridorProps from './CorridorProps';
import BackyardProps from './BackyardProps';
import FrontyardProps from './FrontyardProps';
import CourtyardProps from './CourtyardProps';

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
      <CourtyardProps />
    </>
  );
}
