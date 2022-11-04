import type { Geometry, Position } from 'geojson';
import { Fragment, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl';

export interface Point<T> {
  data: T;
  id: string;
  label: string;
  geometry: Geometry;
}

interface GeoMapMarkersLayerProps<T> {
  autoFitBounds?: boolean;
  onChangeHover?: (point: T | null) => void;
  points: Array<Point<T>>;
}

export function GeoMapMarkersLayer<T>(props: GeoMapMarkersLayerProps<T>): JSX.Element {
  const { autoFitBounds, onChangeHover, points } = props;

  const { common: mapRef } = useMap();
  const [isHovered, setIsHovered] = useState<Point<T>['id'] | null>(null);

  useEffect(() => {
    if (mapRef == null || autoFitBounds !== true) return;

    // mapRef.fitBounds(calculateBounds(points), { padding: 50, duration: 100 });
  }, [autoFitBounds, mapRef, points]);

  return (
    <Fragment>
      {points.map((point) => {
        // TODO: deal with polygons
        if (point.geometry.type !== 'Point') return null;

        const coordinates = point.geometry.coordinates;
        const color = 'tomato'; // FIXME:

        function onHoverStart() {
          setIsHovered(point.id);
          onChangeHover?.(point.data);
        }

        function onHoverEnd() {
          setIsHovered(null);
          onChangeHover?.(null);
        }

        return (
          <GeoMapMarker
            key={point.id}
            color={color}
            coordinates={coordinates}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        );
      })}
    </Fragment>
  );
}

interface GeoMapMarkerProps {
  coordinates: Position;
  color: string;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  /** @default 16 */
  size?: number;
}

function GeoMapMarker(props: GeoMapMarkerProps): JSX.Element {
  const { color, coordinates, onHoverStart, onHoverEnd, size = 16 } = props;

  const [lng, lat] = coordinates;

  return (
    <Marker anchor="center" latitude={lat} longitude={lng}>
      <svg
        className="cursor-pointer"
        height={size}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        viewBox="0 0 24 24"
      >
        <circle cx={12} cy={12} r={size / 2} fill={color} />
      </svg>
    </Marker>
  );
}

function calculateBounds(points: Array<[number, number]>): [number, number, number, number] {
  const lng: Array<number> = [];
  const lat: Array<number> = [];

  points.forEach((point) => {
    lng.push(point[0]);
    lat.push(point[0]);
  });

  const corners = [Math.min(...lng), Math.min(...lat), Math.max(...lng), Math.max(...lat)];

  return corners as [number, number, number, number];
}