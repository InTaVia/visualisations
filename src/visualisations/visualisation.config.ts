import type { EntityEventKind } from '@intavia/api-client'

export const eventKindColors: Record<EntityEventKind['id'], string> = {
  'http://www.intavia.eu/apis/event/personplace': '#999999',
  'http://www.intavia.eu/apis/deathevent': '#ca0020',
  'http://www.intavia.eu/apis/birthevent': '#0571b0',
  default: '#999999',
}
