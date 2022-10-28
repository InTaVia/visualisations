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

async function generate() {
  const options: RequestOptions = { responseType: "json" };

  const url = createUrl({
    baseUrl,
    pathname: "/api/entities/search",
    searchParams: {
      datasets: [dataset.apis, dataset.bs],
      includeEvents: true,
      limit: 100,
    },
  });

  const data = await request(url, options);
  const entitiesById = keyBy(data.results, (entity) => entity.id);

  const fixturesFolder = join(process.cwd(), "stories", "fixtures");
  const filePath = join(fixturesFolder, "entities-100.json");
  await writeFile(
    filePath,
    format(JSON.stringify(entitiesById), { parser: "json" }),
    { encoding: "utf-8" }
  );
}

generate()
  .then(() => {
    log.success("Successfully generated fixtures.");
  })
  .catch((error) => {
    log.error("Failed to generate fixtures.\n", String(error));
  });
