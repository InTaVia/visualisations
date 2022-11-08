import { faker } from '@faker-js/faker';
import { range } from '@stefanprobst/range';
import { action } from '@storybook/addon-actions';
import type { Meta, Story } from '@storybook/react';

import type { GeoMapProps } from '@/features/visualisations/geo-map/geo-map';
import { GeoMap } from '@/features/visualisations/geo-map/geo-map';
import { base as baseMap } from '@/features/visualisations/geo-map/geo-map.config';
import { GeoMapDrawControls } from '../src/features/visualisations/geo-map/geo-map-draw-controls';
import type { Point } from '../src/features/visualisations/geo-map/geo-map-markers-layer';
import { GeoMapMarkersLayer } from '../src/features/visualisations/geo-map/geo-map-markers-layer';
import type { RefAttributes } from 'react';
import type { MapRef } from 'react-map-gl';

import entities001 from "./fixtures/entities-1.json";
import entities002 from "./fixtures/entities-2.json";
import entities020 from "./fixtures/entities-20.json";
import entities100 from "./fixtures/entities-100.json";

const entityGroups = {
  1: entities001,
  2: entities002,
  20: entities020,
  100: entities100
}

const config: Meta = {
  component: GeoMap,
  title: 'Visualisations/GeoMap',
  parameters: {
    actions: {
      /**
       * `react-map-gl` fires callbacks for every `onRender`.
       * TODO: figure out how to disable only selected event handlers
       */
      argTypesRegex: '',
    },
  },
  argTypes: {
    entitiesCount: { control: { type: "select", options: Object.keys(entityGroups)}, defaultValue: Object.keys(entityGroups).at(-1),},
  },
};

export default config;

export const Default = (args: JSX.IntrinsicAttributes & GeoMapProps & RefAttributes<MapRef>): JSX.Element => {
  return <GeoMap {...baseMap} {...args} />;
};

// export const WithDrawControls: Story<GeoMapProps> = function WithDrawControls(args): JSX.Element {
//   return (
//     <GeoMap {...baseMap} {...args}>
//       <GeoMapDrawControls
//         controls={{
//           polygon: true,
//           trash: true,
//         }}
//         defaultMode="draw_polygon"
//         displayControlsDefault={false}
//         onCreate={action('onCreate')}
//         onDelete={action('onDelete')}
//         onUpdate={action('onUpdate')}
//         position="top-left"
//       />
//     </GeoMap>
//   );
// };

export const WithMarkersLayer: Story<GeoMapProps> = function WithMarkersLayer(args): JSX.Element {
  
  // entityGroups[args.entitiesCount as number]

  const points: Array<Point<{ id: string }>> = range(0, args.entitiesCount as number - 1).map((i) => {
    const id = String(i);

    return {
      id,
      data: { id },
      label: `Point ${id}`,
      geometry: {
        type: 'Point',
        coordinates: [
          Number(faker.address.longitude(40, -10)),
          Number(faker.address.latitude(70, 30)),
        ],
      },
    };
  });

  return (
    <GeoMap {...baseMap} {...args}>
      <GeoMapMarkersLayer onChangeHover={action('onChangeHover')} points={points} />
    </GeoMap>
  );
};