import type { FeatureCollection, Point } from 'geojson'
import get from 'lodash.get'
import { useMemo } from 'react'

interface UseMarkerClusterParams<T> {
  /** Dotted path to feature property by which to cluster. */
  clusterProperty: string
  colors: Record<string, string>
  data: FeatureCollection<Point, T>
}

interface UseMarkerClusterResult<T> {
  colors: Record<string, string>
  data: FeatureCollection<Point, T>
  isCluster: true
  clusterProperties: Record<string, unknown>
  circleColors: Array<unknown>
}

export function useMarkerCluster<T>(params: UseMarkerClusterParams<T>): UseMarkerClusterResult<T> {
  const { clusterProperty, colors, data } = params

  const options = useMemo(() => {
    const values = new Set()

    data.features.forEach((feature) => {
      const value = get(feature.properties, clusterProperty)
      values.add(value)
    })
    console.log(values)

    const clusterProperties: Record<string, unknown> = {}
    const circleColors = ['case']

    const expression = clusterProperty.split('.').reduce((acc, segment) => {
      return acc.length > 0 ? ['get', segment, acc] : ['get', segment]
    }, [])

    values.forEach((value) => {
      const equalsExpression = ['==', expression, value]

      const clusterAccumulatorExpression = ['+', ['case', equalsExpression, 1, 0]]
      clusterProperties[value] = clusterAccumulatorExpression

      circleColors.push(equalsExpression, colors[value])
    })

    circleColors.push(colors['default'])

    return {
      // accumulator expression
      clusterProperties,
      // circle paint expression
      circleColors,
    }
  }, [clusterProperty, colors, data]) // FIXME: memo

  return { colors, data, isCluster: true, ...options }
}
