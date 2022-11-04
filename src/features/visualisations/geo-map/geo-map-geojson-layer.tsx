import type { FeatureCollection } from 'geojson';
import { Layer, Source, useMap } from 'react-map-gl';

interface GeoMapGeoJsonLayerProps<T> {
  id: string;
  autoFitBounds?: boolean;
  onChangeHover?: (point: T | null) => void;
  geoJsonData: FeatureCollection;
  type?: 'line';
}

export function GeoMapGeoJsonLayer<T>(props: GeoMapGeoJsonLayerProps<T>): JSX.Element {
  const { id, geoJsonData, type = 'line' } = props;

//   const { common: mapRef } = useMap();

  return (
    <Source type="geojson" data={geoJsonData} lineMetrics>
      <Layer
        id={id}
        type={type}
        paint={{ 'line-width': 2, 'line-color': '#666', 'line-opacity': 0.4 }}
      />
    </Source>
  );
}
