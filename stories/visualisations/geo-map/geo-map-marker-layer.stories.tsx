import type { Meta, StoryObj } from '@storybook/react'

import {
  type GeoMapMarkerLayerProps,
  GeoMapMarkerLayer,
} from '@/visualisations/geo-map/geo-map-marker-layer'
import fixtureOneEntity from '~/stories/fixtures/fixture-1.json'
import fixtureTwoEntities from '~/stories/fixtures/fixture-2.json'
import fixtureTwentyEntities from '~/stories/fixtures/fixture-20.json'
import fixtureHundredEntities from '~/stories/fixtures/fixture-100.json'
import { GeoMapDecorator } from '~/stories/visualisations/geo-map/geo-map.decorator'
import { usePointFeatureCollection } from '~/stories/visualisations/geo-map/use-point-feature-collection'

const fixtures = {
  one: fixtureOneEntity,
  two: fixtureTwoEntities,
  twenty: fixtureTwentyEntities,
  hundred: fixtureHundredEntities,
}

type GeoMapMarkerLayerStoryProps = GeoMapMarkerLayerProps & {
  count: keyof typeof fixtures
  cluster: boolean
}

const meta: Meta<GeoMapMarkerLayerStoryProps> = {
  title: 'Visualisations/GeoMap/GeoMapMarkerLayer',
  component: GeoMapMarkerLayer,
  decorators: [GeoMapDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['docsPage'],
  argTypes: {
    count: {
      control: { type: 'select' },
      options: Object.keys(fixtures),
      defaultValue: Object.keys(fixtures).at(-1),
    },
  },
}

export default meta

export const Default: StoryObj<GeoMapMarkerLayerStoryProps> = {
  args: {
    count: 'hundred',
    cluster: true,
  },
  render(args) {
    const count = args.count as keyof typeof fixtures
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { points } = usePointFeatureCollection(fixtures[count])
    return <GeoMapMarkerLayer data={points} cluster={args.cluster} />
  },
}
