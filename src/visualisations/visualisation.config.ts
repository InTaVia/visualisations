import type { EntityEventKind } from '@intavia/api-client'

export const eventKindColors: Record<EntityEventKind['id'], string> = {
  birthevent: '#0571b0',
  deathevent: '#ca0020',
  personplace: '#999999',
  event: '#999999',
  default: '#999999',
}
