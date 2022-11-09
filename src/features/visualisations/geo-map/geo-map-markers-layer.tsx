import type { Geometry } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';
import { GeoMapMarker } from './geo-map-marker';
import { calculateBoundsFromPoints } from './geo-map-utils';

export interface Feature<T> {
  data: T;
  id: string;
  label: string;
  geometry: Geometry;
}

interface GeoMapMarkersLayerProps<T> {
  autoFitBounds?: boolean;
  onChangeHover?: (point: T | null) => void;
  onClick?: (point: T | null) => void;
  features: Array<Feature<T>>;
}

export function GeoMapMarkersLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
  const { autoFitBounds, onChangeHover, onClick, features } = props;

  const { current: mapRef } = useMap();
  const [isHovered, setIsHovered] = useState<Feature<T>['id'] | null>(null);
  const [wasClicked, setWasClicked] = useState<Feature<T>['id'] | null>(null);

  useEffect(() => {
    if (mapRef == null || autoFitBounds !== true) return;
    const coordinates = features.map((point) => { if (point.geometry.type !== 'Point') return null; return point.geometry.coordinates as [number, number]}).filter(Boolean) as Array<[number, number]>
    mapRef.fitBounds(calculateBoundsFromPoints(coordinates), { padding: 50, duration: 100 });
  }, [autoFitBounds, mapRef, features]);

  return (
    <Fragment>
      {features.map((feature) => {
        
        // TODO: deal with polygons calculate centroid/center/centerOfMass (see turf.js) / Polygon on Surface for concave Polygons?
        if (feature.geometry.type !== 'Point') return null;
      
        const coordinates = feature.geometry.coordinates;
        const color = 'tomato'; // FIXME:

        function onHoverStart() {
          setIsHovered(feature.id);
          onChangeHover?.(feature.data);
        }

        function onHoverEnd() {
          setIsHovered(null);
          onChangeHover?.(null);
        }

        function onMouseClick() {
          setWasClicked(feature.id);
          onClick?.(feature.data);
        }

        return (
          <GeoMapMarker
            key={feature.id}
            color={color}
            coordinates={coordinates}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            onClick={onMouseClick}
          />
        );
      })}
    </Fragment>
  );
}