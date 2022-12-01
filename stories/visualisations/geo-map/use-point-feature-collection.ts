import type { Entity, EntityEvent, Place } from '@intavia/api-client'
import type { Feature, FeatureCollection, Point } from 'geojson'
import { useMemo } from 'react'

import { createPointFeature } from '@/visualisations/geo-map/lib/create-point-feature'
import { isValidPoint } from '@/visualisations/geo-map/lib/is-valid-point'

interface UsePointFeatureCollectionParams {
  events: Record<EntityEvent['id'], EntityEvent>
  entities: Record<Entity['id'], Entity>
}

interface UsePointFeatureCollectionResult {
  points: FeatureCollection<Point, { event: EntityEvent; place: Place }>
}

export function usePointFeatureCollection(
  params: UsePointFeatureCollectionParams,
): UsePointFeatureCollectionResult {
  const { events, entities } = params

  const points: FeatureCollection<Point, { event: EntityEvent; place: Place }> = useMemo(() => {
    const features: Array<Feature<Point, { event: EntityEvent; place: Place }>> = []

    Object.values(events).forEach((event) => {
      // FIXME: published types are wrong
      const id = event.place as unknown as Place['id'] | undefined
      if (id == null) return

      const place = entities[id]
      if (place == null) return
      if (place.kind !== 'place') return
      if (place.geometry == null) return
      if (!isValidPoint(place.geometry)) return

      features.push(createPointFeature({ place, event }))
    })

    return {
      type: 'FeatureCollection',
      features,
    }
  }, [events, entities])

  return {
    points,
  }
}
