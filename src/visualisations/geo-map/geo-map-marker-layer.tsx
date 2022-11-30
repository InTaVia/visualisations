import type { Feature, FeatureCollection, Point } from 'geojson'
import { useId, useMemo } from 'react'
import { type LayerProps, Layer, Source } from 'react-map-gl'

import { createKey } from '@/lib/create-key'
import { DonutChartLayer } from '@/visualisations/geo-map/donut-chart-layer'

export interface GeoMapMarkerLayerProps<T extends EmptyObject = EmptyObject> {
  circleColors: Array<unknown>
  // clusterColors?: Record<string, string>
  clusterProperties?: Record<string, unknown>
  colors: Record<string, string>
  /** @default 50 */
  data: FeatureCollection<Point, T>
  /** @default false */
  isCluster?: boolean
  onChangeHover?: (feature: Feature<Point, T> | null) => void
}

/**
 * GeoJSON marker layer for geo-visualisation.
 */
export function GeoMapMarkerLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapMarkerLayerProps<T>,
): JSX.Element {
  const { circleColors, clusterProperties, colors, data, isCluster = false, onChangeHover } = props

  const id = useId()

  const layer = useMemo(() => {
    const layer: LayerProps = {
      type: 'circle',
      paint: {
        'circle-color': circleColors,
        'circle-radius': 5,
      },
      /** Only paint circles which are not included in the cluster. */
      filter: ['!=', 'cluster', true],
    }

    return layer
  }, [circleColors])

  return (
    <Source
      key={createKey(id, String(isCluster))}
      id={id}
      cluster={isCluster}
      clusterRadius={100}
      clusterProperties={clusterProperties}
      data={data}
      type="geojson"
    >
      <Layer {...layer} />
      {isCluster ? <DonutChartLayer colors={colors} id={id} onChangeHover={onChangeHover} /> : null}
    </Source>
  )
}
