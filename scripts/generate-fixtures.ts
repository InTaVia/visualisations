import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import "@stefanprobst/request/fetch";
import { request, createUrl } from "@stefanprobst/request";
import type { RequestOptions } from "@stefanprobst/request";
import { log } from "@stefanprobst/log";
import { format } from "prettier";
import { keyBy } from "@stefanprobst/key-by";

const baseUrl = "https://intavia-backend.acdh-dev.oeaw.ac.at";

const dataset = {
  apis: "https://apis.acdh.oeaw.ac.at/data",
  bs: "http://ldf.fi/nbf/data",
};

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
  const entities = data.results.map((entity: any) => {return {...entity, events: entity.events.map((event: any) => event.id)}});
  const entitiesById = keyBy(entities, (entity) => entity.id);

  //extract events from entities; Set used to remove duplicates comming from different entitites
  const events: Array<Record<string, any>> = Array.from(new Set(data.results.flatMap((entity: any) => entity.events)));
  const eventsById = keyBy(events, (event) => event['id']);

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

[1, 2, 20, 100].forEach(limit =>{ generate(limit)
  .then(() => {
    log.success(`Successfully generated entity and event fixtures for entity count = ${limit}`);
  })
  .catch((error) => {
    log.error(`Failed to generate entity and event fixtures for ntity count = ${limit} .\n`, String(error));
  });
})
