import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Fragment, useEffect, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl";

export interface GeoMapClusterMarkersLayerProps<T> {
  id: string;
  geoJsonData: FeatureCollection;
  autoFitBounds?: boolean;
  cluster?: boolean;
  clusterRadius?: number;
  clusterProperties?: Record<string, any>;
  clusterColors?: Record<string, any>;
  paint: Record<string, any>;
}

export function GeoMapClusterMarkersLayer<T>(
  props: GeoMapClusterMarkersLayerProps<T>
): JSX.Element {
  const {
    id,
    geoJsonData,
    autoFitBounds = true,
    cluster = false,
    clusterRadius = 50,
    clusterProperties = {},
    clusterColors = {},
    paint = {},
  } = props;

  const [clusterMarkers, setClusterMarkers] = useState<Record<string, any>>({});

  const { current: mapRef } = useMap();

  useEffect(() => {
    if (mapRef == null) return;
    mapRef.on("render", () => {
      // console.log("updateClusterMarkers");
      updateClusterMarkers();
    });
    // if (autoFitBounds !== true) return;
    // const coordinates = features
    //   .map((point) => {
    //     if (point.geometry.type !== "Point") return null;
    //     return point.geometry.coordinates as [number, number];
    //   })
    //   .filter(Boolean) as Array<[number, number]>;
    // mapRef.fitBounds(calculateBoundsFromPoints(coordinates), {
    //   padding: 50,
    //   duration: 100,
    // });
    // mapRef.on("render", () => {
    //   console.log("render");
    // });
  }, [autoFitBounds, mapRef, clusterMarkers, geoJsonData]);

  function updateClusterMarkers() {
    const newClusterMarkers: Record<string, any> = {};
    const features = mapRef?.querySourceFeatures(`${id}Source`);

    for (const feature of features!) {
      const featureProperties = feature.properties;
      if (!featureProperties!["cluster"]) {
        continue;
      }
      const featureGeometry = feature.geometry;
      const clusterId = featureProperties!["cluster_id"];
      let clusterMarker = clusterMarkers[clusterId];
      if (clusterMarker == null) {
        clusterMarker = {
          properties: featureProperties,
          geometry: featureGeometry,
        };
      }
      newClusterMarkers[clusterId] = clusterMarker;
    }
    setClusterMarkers(newClusterMarkers);
  }

  return (
    <Fragment>
      <Source
        type="geojson"
        id={`${id}Source`}
        data={geoJsonData}
        cluster={cluster}
        clusterRadius={clusterRadius}
        clusterProperties={clusterProperties}
      >
        <Layer
          id={`${id}Layer`}
          source={`${id}Source`}
          type="circle"
          filter={["!=", "cluster", true]}
          paint={paint}
        />
      </Source>

      {Object.values(clusterMarkers).map((clusterMarker, index) => {
        return (
          <Marker
            key={`clusterMarker-${index}`}
            longitude={clusterMarker.geometry.coordinates[0]}
            latitude={clusterMarker.geometry.coordinates[1]}
            anchor="center"
          >
            <DonutChartSvg
              clusterProperties={clusterMarker.properties}
              clusterColors={clusterColors}
            />
          </Marker>
        );
      })}
    </Fragment>
  );
}

interface DonutChartSvgProps {
  clusterProperties: GeoJsonProperties; //FIXME, not really the correct type
  clusterColors: Record<string, any>;
}

export function DonutChartSvg(props: DonutChartSvgProps): JSX.Element {
  const { clusterProperties, clusterColors } = props;

  const {
    cluster,
    cluster_id,
    point_count,
    point_count_abbreviated,
    ...clusterCounts
  } = clusterProperties;
  console.log(clusterCounts);
  const segmentOffsets = [];
  let totalCount = 0;
  for (const clusterCount of Object.entries(clusterCounts)) {
    segmentOffsets.push(totalCount);
    totalCount += clusterCount[1];
  }

  // console.log(totalCount, segmentOffsets);

  const fontSize =
    totalCount >= 1000
      ? 22
      : totalCount >= 100
      ? 20
      : totalCount >= 10
      ? 18
      : 16;
  const r =
    totalCount >= 1000
      ? 50
      : totalCount >= 100
      ? 32
      : totalCount >= 10
      ? 24
      : 18;
  const r0 = Math.round(r * 0.6);
  const w = r * 2;

  return (
    <svg
      width={`${w}`}
      height={`${w}`}
      viewBox={`0 0 ${w} ${w}`}
      textAnchor="middle"
    >
      <circle cx={r} cy={r} r={r} fill="white"></circle>
      {Object.entries(clusterCounts).map((cluster, index) => {
        return (
          <DonutSegment
            start={segmentOffsets[index] / totalCount}
            end={
              (segmentOffsets[index] + clusterCounts[cluster[0]]) / totalCount
            }
            r={r}
            r0={r0}
            color={clusterColors[cluster[0]]}
          />
        );
      })}

      {/* {Array.from(Array(counts.length).keys()).map((item, index) => {
        return <DonutSegment start={offsets[index] / total} end={(offsets[index] + counts[index]) / total}, r={r}, r0={r0}, color={colors[index]}) />
      })} */}
      <text dominantBaseline="central" transform={`translate(${r}, ${r})`}>
        {totalCount.toLocaleString()}
      </text>
    </svg>
  );
}

interface DonutSegmentProps {
  start: number;
  end: number;
  r: number;
  r0: number;
  color: string;
}

export function DonutSegment(props: DonutSegmentProps): JSX.Element {
  const { start, end, r, r0, color } = props;
  let end_ = end;
  console.log(start, end, r, r0, color);

  if (end - start === 1) end_ -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end_ - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end_ - start > 0.5 ? 1 : 0;

  return (
    <path
      d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
      } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
      } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
      }`}
      fill={`${color}`}
    />
  );
}
