import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import "@stefanprobst/request/fetch";
import { request, createUrl } from "@stefanprobst/request";
import type { RequestOptions } from "@stefanprobst/request";
import { log } from "@stefanprobst/log";
import { format } from "prettier";
import { keyBy } from "@stefanprobst/key-by";

import type {
  Entity,
  EntityEvent,
  EntityEventKind,
} from "@/api/intavia.models";

const baseUrl = "https://intavia-backend.acdh-dev.oeaw.ac.at";

const dataset = {
  apis: "https://apis.acdh.oeaw.ac.at/data",
  bs: "http://ldf.fi/nbf/data",
};

//TEMP FIX
function deriveEntityEventKind(eventId: EntityEvent["id"]): EntityEventKind {
  const id = eventId.substring(0, eventId.lastIndexOf("/"));
  const kindLabel = id.substring(id.lastIndexOf("/") + 1);

  return {
    id: id,
    label: { default: kindLabel },
  } as EntityEventKind;
}

function deriveEntityEventType(eventId: EntityEvent["id"]): string {
  const id = eventId.substring(0, eventId.lastIndexOf("/"));
  const type = id.substring(id.lastIndexOf("/") + 1);
  return type;
}

async function generate(limit: number) {
  const options: RequestOptions = { responseType: "json" };

  const url = createUrl({
    baseUrl,
    pathname: "/api/entities/search",
    searchParams: {
      datasets: [dataset.apis, dataset.bs],
      includeEvents: true,
      limit: limit,
    },
  });

  const data = await request(url, options);

  //reduce events array to array of event ids
  const entities: Array<Entity> = data.results.map((entity: Entity) => {
    return {
      ...entity,
      events: entity.events!.map((event) => event.id as EntityEvent["id"]),
    };
  });
  const entitiesById = keyBy(entities, (entity) => entity.id);

  //extract events from entities; Set used to remove duplicates comming from different entitites
  const events: Array<EntityEvent> = Array.from(
    new Set(data.results.flatMap((entity: Entity) => entity.events))
  );
  //TEMP FIX to swap coordinates of places of events
  const eventsCoordinatesSwapped = events.map((event) => {
    if (
      "place" in event &&
      "geometry" in event.place &&
      "coordinates" in event.place.geometry
    ) {
      return {
        ...event,
        place: {
          ...event.place,
          geometry: {
            ...event.place.geometry,
            coordinates: [
              event.place.geometry.coordinates[1],
              event.place.geometry.coordinates[0],
            ],
          },
        },
      };
    } else {
      return event;
    }
  });
  //TEMP FIX derive event kind from event id
  const eventsWithEventKind = eventsCoordinatesSwapped.map((event) => {
    return {
      ...event,
      kind: deriveEntityEventKind(event.id),
      type: deriveEntityEventType(event.id),
    };
  });

  const eventsById = keyBy(eventsWithEventKind, (event) => event["id"]);

  const fixturesFolder = join(process.cwd(), "stories", "fixtures");
  const filePathEntities = join(fixturesFolder, `entities-${limit}.json`);
  await writeFile(
    filePathEntities,
    format(JSON.stringify(entitiesById), { parser: "json" }),
    { encoding: "utf-8" }
  );
  const filePathEvents = join(fixturesFolder, `events-${limit}.json`);
  await writeFile(
    filePathEvents,
    format(JSON.stringify(eventsById), { parser: "json" }),
    { encoding: "utf-8" }
  );
}

[1, 2, 20, 100].forEach((limit) => {
  generate(limit)
    .then(() => {
      log.success(
        `Successfully generated entity and event fixtures for entity count = ${limit}`
      );
    })
    .catch((error) => {
      log.error(
        `Failed to generate entity and event fixtures for entity count = ${limit} .\n`,
        String(error)
      );
    });
});
