import type { Decorator } from '@storybook/react'

import { GeoMap } from '@/features/visualisations/geo-map/geo-map'
import { base } from '@/features/visualisations/geo-map/geo-map.config'

export const GeoMapDecorator: Decorator<unknown> = (story, _context) => {
  return <GeoMap {...base}>{story()}</GeoMap>
}
