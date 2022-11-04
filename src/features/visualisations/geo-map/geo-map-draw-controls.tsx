import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature } from 'geojson';
import type { ControlPosition } from 'maplibre-gl';
import { useEffect } from 'react';
import { useControl } from 'react-map-gl';

import { noop } from '@/lib/noop';
import { useInitialValue } from '@/lib/use-initial-value';

type GeoMapDrawControlsProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  initialFeatures?: Array<Feature> | null;
  onCreate?: (event: { features: Array<Feature> }) => void;
  onUpdate?: (event: { features: Array<Feature>; action: string }) => void;
  onDelete?: (event: { features: Array<Feature> }) => void;
  position?: ControlPosition;
};

export function GeoMapDrawControls(props: GeoMapDrawControlsProps): null {
  const { initialFeatures, onCreate = noop, onUpdate = noop, onDelete = noop, position } = props;

  const draw = useControl(
    () => {
      return new MapboxDraw(props);
    },
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    { position },
  );

  const initialFeaturesValue = useInitialValue(initialFeatures);
  useEffect(() => {
    if (initialFeaturesValue == null) return;

    initialFeaturesValue.forEach((feature) => {
      draw.add(feature);
    });
  }, [draw, initialFeaturesValue]);

  return null;
}