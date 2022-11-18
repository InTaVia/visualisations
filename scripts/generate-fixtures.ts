import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  type Entity,
  type EntityEvent,
  configureApiBaseUrl,
  searchEntities,
} from '@intavia/api-client'
import { log } from '@stefanprobst/log'
import { normalize, schema } from 'normalizr'
import { format } from 'prettier'

const fixtureSizes = [1, 2, 20, 100]

configureApiBaseUrl('https://intavia-backend.acdh-dev.oeaw.ac.at')

const entity = new schema.Entity<Entity>('entities')
const event = new schema.Entity<EntityEvent>('events', { place: entity, relations: [{ entity }] })
entity.define({ events: [event] })

async function generate(limit: number) {
  const data = await searchEntities.request({
    datasets: ['https://apis.acdh.oeaw.ac.at/data', 'http://ldf.fi/nbf/data'],
    // @ts-expect-error FIXME: `includeEvents` is deprecated, but currently the only way to retrieve entity events
    includeEvents: true,
    limit,
  })

  const { entities } = normalize<unknown, { entities: Array<Entity>; events: Array<EntityEvent> }>(
    data.results,
    [entity],
  )

  const entitiesById = entities.entities
  const eventsById = entities.events

  const fixturesFolder = join(process.cwd(), 'stories', 'fixtures')
  await mkdir(fixturesFolder, { recursive: true })

  const filePathEntities = join(fixturesFolder, `entities-${limit}.json`)
  await writeFile(filePathEntities, format(JSON.stringify(entitiesById), { parser: 'json' }), {
    encoding: 'utf-8',
  })
  const filePathEvents = join(fixturesFolder, `events-${limit}.json`)
  await writeFile(filePathEvents, format(JSON.stringify(eventsById), { parser: 'json' }), {
    encoding: 'utf-8',
  })
}

fixtureSizes.forEach((limit) => {
  generate(limit)
    .then(() => {
      log.success(`Successfully generated entity and event fixtures for entity count = ${limit}.`)
    })
    .catch((error) => {
      log.error(
        `Failed to generate entity and event fixtures for entity count = ${limit}.\n`,
        String(error),
      )
    })
})
