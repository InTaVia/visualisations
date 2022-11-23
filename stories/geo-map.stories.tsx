import { faker } from "@faker-js/faker";
import { range } from "@stefanprobst/range";
import { action } from "@storybook/addon-actions";
import type { Meta, Story, StoryObj } from "@storybook/react";

import type { GeoMapProps } from "@/features/visualisations/geo-map/geo-map";
import { GeoMap } from "@/features/visualisations/geo-map/geo-map";
import { base as baseMap } from "@/features/visualisations/geo-map/geo-map.config";
import { GeoMapDrawControls } from "../src/features/visualisations/geo-map/geo-map-draw-controls";
import type { Feature } from "../src/features/visualisations/geo-map/geo-map-markers-layer";
import { GeoMapMarkersLayer } from "../src/features/visualisations/geo-map/geo-map-markers-layer";
import type { RefAttributes } from "react";
import type { MapRef } from "react-map-gl";

import entities001 from "./fixtures/entities-1.json";
import entities002 from "./fixtures/entities-2.json";
import entities020 from "./fixtures/entities-20.json";
import entities100 from "./fixtures/entities-100.json";

import events001 from "./fixtures/events-1.json";
import events002 from "./fixtures/events-2.json";
import events020 from "./fixtures/events-20.json";
import events100 from "./fixtures/events-100.json";
import {
  mapEventsToGeoJsonPointFeatureCollection,
  mapEventsToPointFeatures,
} from "@/features/visualisations/geo-map/geo-map-data-mapper";
import { GeoMapClusterMarkersLayer } from "@/features/visualisations/geo-map/geo-map-cluster-markers-layer";

const entityGroups = {
  1: entities001,
  2: entities002,
  20: entities020,
  100: entities100,
};

const eventsForEntityGroups = {
  1: events001,
  2: events002,
  20: events020,
  100: events100,
};

const argTypes = {
  entitiesCount: {
    control: { type: "select", options: Object.keys(entityGroups) },
    defaultValue: Object.keys(entityGroups).at(-1),
  },
};

const config: Meta = {
  component: GeoMap,
  title: "Visualisations/GeoMap",
  parameters: {
    controls: {
      include: Object.keys(argTypes),
    },
    actions: {
      /**
       * `react-map-gl` fires callbacks for every `onRender`.
       * TODO: figure out how to disable only selected event handlers
       */
      argTypesRegex: "",
    },
  },
  argTypes: argTypes,
};

export default config;

export const Default: StoryObj = {
  args: {
    ...baseMap,
  },
};

// export const Default = (
//   args: JSX.IntrinsicAttributes & GeoMapProps & RefAttributes<MapRef>
// ): JSX.Element => {
//   return <GeoMap {...baseMap} {...args} />;
// };

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

export const MarkersLayer: Story<GeoMapProps> = function MarkersLayer(
  args: JSX.IntrinsicAttributes & GeoMapProps & RefAttributes<MapRef>
): JSX.Element {
  // FIXME: Put into geo-map-data-mapper
  const entities = entityGroups[args.entitiesCount as number];
  const events = eventsForEntityGroups[args.entitiesCount as number];
  const data = mapEventsToPointFeatures(entities, events);

  // console.log(data);

  return (
    <GeoMap {...baseMap} {...args}>
      <GeoMapMarkersLayer
        onChangeHover={action("onChangeHover")}
        onClick={action("onClick")}
        features={data}
        autoFitBounds={true}
      />
    </GeoMap>
  );
};

export const ClusterMarkersLayer: Story<GeoMapProps> =
  function ClusterMarkersLayer(
    args: JSX.IntrinsicAttributes & GeoMapProps & RefAttributes<MapRef>
  ): JSX.Element {
    // FIXME: Put into geo-map-data-mapper
    const entities = entityGroups[args.entitiesCount as number];
    const events = eventsForEntityGroups[args.entitiesCount as number];
    const data = mapEventsToGeoJsonPointFeatureCollection(entities, events);
    const eventTypes = Object.fromEntries(
      [
        ...new Set(
          data.features.map((feature) => {
            return feature!.properties!["type"];
          })
        ),
      ].map((eventType) => {
        //FIXME nested objects?
        const equalsExpression = [
          "==",
          ["get", "kind", ["get", "label", ["get", "default"]]],
          eventType,
        ];
        return [
          eventType,
          {
            equalsExpression: equalsExpression,
            clusterAccumulatorExpression: [
              "+",
              ["case", equalsExpression, 1, 0],
            ],
          },
        ];
      })
    );

    const clusterProperties = Object.fromEntries(
      Object.entries(eventTypes).map((eventType) => {
        return [eventType[0], eventType[1].clusterAccumulatorExpression];
      })
    );

    const eventTypeColors: Record<string, any> = {
      birthevent: "#0571b0",
      deathevent: "#ca0020",
      personplace: "#999999",
      event: "#999999",
      default: "#999999",
    };

    const paintCircleColor = ["case"];
    for (const eventType of Object.entries(eventTypes)) {
      // console.log(eventType[0], eventType[1].equalsExpression);
      paintCircleColor.push(eventType[1].equalsExpression);
      paintCircleColor.push(eventTypeColors[eventType[0]]);
    }
    paintCircleColor.push(eventTypeColors["default"]); //default Color

    return (
      <GeoMap {...baseMap} {...args}>
        <GeoMapClusterMarkersLayer
          // onChangeHover={action("onChangeHover")}
          // onClick={action("onClick")}
          id="ExampleClusterLayer"
          geoJsonData={data}
          autoFitBounds={true}
          cluster={true}
          clusterRadius={50}
          clusterProperties={clusterProperties}
          clusterColors={eventTypeColors}
          //FIXME move paint creation into layer and also clusterProperties; only send colors + field to cluster by and values
          paint={{
            "circle-color": paintCircleColor,
            "circle-radius": 5,
          }}
        />
      </GeoMap>
    );
  };

export const TrajectoriesLayer: Story<GeoMapProps> = function TrajectoriesLayer(
  args: JSX.IntrinsicAttributes & GeoMapProps & RefAttributes<MapRef>
): JSX.Element {};
