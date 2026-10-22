import raw from '../../content/hotspots.json';
import { getHotspotMap } from './load';

export const hotspotMap = getHotspotMap(raw);
export const hotspots = hotspotMap.hotspots;