// TODO

import type { Entity, EntityEvent } from "@/api/intavia.models";
import type { FeatureCollection, Feature } from "geojson";
import { faker } from "@faker-js/faker";
import type { Feature as PointFeature } from "./geo-map-markers-layer";
import { eventHasValidPlace } from "./geo-map-utils";

export function mapEventsToPointFeatures(
  entities: Record<Entity["id"], Entity>,
  events: Record<EntityEvent["id"], EntityEvent>
): Array<PointFeature<{ id: string }>> {
  const eventIds = getAllEventIdsOfEntities(entities);

  const eventsWithPlace: Array<PointFeature<{ id: string }>> = eventIds
    .map((eventId) => {
      const id = String(eventId);
      const event = events[id] as EntityEvent;

      if (eventHasValidPlace(event)) {
        return {
          id,
          data: event,
          label: event.label.default,
          geometry: event.place?.geometry,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return eventsWithPlace;
}

export function mapEventsToGeoJsonPointFeatureCollection(
  entities: Record<Entity["id"], Entity>,
  events: Record<EntityEvent["id"], EntityEvent>
): FeatureCollection {
  const eventIds = getAllEventIdsOfEntities(entities);
  const geoFeatures: Array<Feature> = eventIds
    .map((eventId) => {
      const id = String(eventId);
      const event = events[id] as EntityEvent;

      if (eventHasValidPlace(event)) {
        return {
          type: "Feature",
          geometry: event.place?.geometry,
          properties: {
            ...event,
          },
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return {
    type: "FeatureCollection",
    features: geoFeatures,
  } as FeatureCollection;
}

function getAllEventIdsOfEntities(
  entities: Record<Entity["id"], Entity>
): Array<EntityEvent["id"]> {
  const eventIds = Object.values(entities).flatMap((entity: Entity) => {
    return entity.events;
  });
  return eventIds as Array<EntityEvent["id"]>;
}

function mapEventsToLineStringFeatures() {}
