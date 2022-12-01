import type { Decorator } from '@storybook/react'

import { GeoMap } from '@/visualisations/geo-map/geo-map'
import { base } from '@/visualisations/geo-map/geo-map.config'

export const GeoMapDecorator: Decorator<unknown> = (story, _context) => {
  return <GeoMap {...base}>{story()}</GeoMap>
}
