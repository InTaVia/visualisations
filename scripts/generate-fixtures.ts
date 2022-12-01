import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  type Entity,
  type EntityEvent,
  configureApiBaseUrl,
  searchEntities,
} from '@intavia/api-client'
import { keyBy } from '@stefanprobst/key-by'
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

  const _entitiesById = entities.entities
  const _eventsById = entities.events

  const _entities = Object.values(_entitiesById)
    // FIXME: the backend currently returns incorrect geojson coordinates in [lat, lng], but geojson requires [lng, lat].
    .map((entity) => {
      if (entity.kind !== 'place') return entity
      if (entity.geometry == null || entity.geometry.type !== 'Point') return entity

      return {
        ...entity,
        geometry: {
          ...entity.geometry,
          coordinates: [entity.geometry.coordinates[1], entity.geometry.coordinates[0]],
        },
      }
    })

  const _events = Object.values(_eventsById)
    // FIXME: the backend currently does not return event kinds.
    .map((event) => {
      const id = event.id.slice(0, event.id.lastIndexOf('/'))
      const label = id.slice(id.lastIndexOf('/') + 1)

      return {
        ...event,
        kind: {
          id: id,
          label: { default: label },
        },
      }
    })
  const eventsById = keyBy(_events, (event) => {
    return event.id
  })

  const entitiesById = keyBy(_entities, (entity) => {
    return entity.id
  })

  const fixturesFolder = join(process.cwd(), 'stories', 'fixtures')
  await mkdir(fixturesFolder, { recursive: true })

  await writeFile(
    join(fixturesFolder, `fixture-${limit}.json`),
    format(JSON.stringify({ entities: entitiesById, events: eventsById }), { parser: 'json' }),
    { encoding: 'utf-8' },
  )
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
