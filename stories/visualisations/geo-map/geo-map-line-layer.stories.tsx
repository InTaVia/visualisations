import type { Meta, StoryObj } from '@storybook/react'

import {
  type GeoMapLineLayerProps,
  GeoMapLineLayer,
} from '@/features/visualisations/geo-map/geo-map-line-layer'
import { GeoMapDecorator } from '~/stories/visualisations/geo-map/geo-map.decorator'

const meta: Meta<GeoMapLineLayerProps> = {
  title: 'Visualisations/GeoMap/GeoMapLineLayer',
  component: GeoMapLineLayer,
  decorators: [GeoMapDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['docsPage'],
}

export default meta

export const Default: StoryObj<GeoMapLineLayerProps> = {
  args: {
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [11.957296093750841, 52.521233157741705],
              [21.80104609375107, 51.766138498354366],
              [21.185811718750273, 44.44750491756878],
              [6.464132031250557, 46.39051497316453],
              [5.409444531250159, 49.85037903821271],
            ],
          },
          properties: {},
        },
      ],
    },
  },
}
