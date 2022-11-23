import type { Meta, StoryObj } from '@storybook/react'

import {
  type GeoMapDrawControlsProps,
  GeoMapDrawControls,
} from '@/visualisations/geo-map/geo-map-draw-controls'
import { GeoMapDecorator } from '~/stories/visualisations/geo-map/geo-map.decorator'

const meta: Meta<GeoMapDrawControlsProps> = {
  title: 'Visualisations/GeoMap/GeoMapDrawControls',
  component: GeoMapDrawControls,
  decorators: [GeoMapDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['docsPage'],
}

export default meta

export const Default: StoryObj<GeoMapDrawControlsProps> = {}

export const InitialFeatures: StoryObj<GeoMapDrawControlsProps> = {
  args: {
    initialData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [11.957296093750841, 52.521233157741705],
                [21.80104609375107, 51.766138498354366],
                [21.185811718750273, 44.44750491756878],
                [6.464132031250557, 46.39051497316453],
                [5.409444531250159, 49.85037903821271],
                [11.957296093750841, 52.521233157741705],
              ],
            ],
          },
          properties: {},
        },
      ],
    },
  },
}
