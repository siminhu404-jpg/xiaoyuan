import Gate from './Gate';
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
          <Gate />
          <JujubeTree />
          <FrontyardProps />
        </>
      )}
      {corridor && (
        <>
          <Cats />
          <CorridorProps />
        </>
      )}
      {backyard && (
        <>
          <Roses />
          <BackyardProps />
          <CourtyardProps />
        </>
      )}
    </>
  );
}
