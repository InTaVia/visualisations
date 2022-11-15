import { faker } from "@faker-js/faker";
import { range } from "@stefanprobst/range";
import { action } from "@storybook/addon-actions";
import type { Meta, Story, StoryObj } from "@storybook/react";

import type { GeoMapProps } from "@/features/visualisations/geo-map/geo-map";
import { TimelineIndiviDual } from "@/features/visualisations/timeline/timeline";
import { base as baseMap } from "@/features/visualisations/geo-map/geo-map.config";
import { GeoMapDrawControls } from "../src/features/visualisations/geo-map/geo-map-draw-controls";
import type { Point } from "../src/features/visualisations/geo-map/geo-map-markers-layer";
import { GeoMapMarkersLayer } from "../src/features/visualisations/geo-map/geo-map-markers-layer";
import type { RefAttributes } from "react";
import type { MapRef } from "react-map-gl";

import entities from "./fixtures/entities-2.json";
import events from "./fixtures/events-2.json";

let dataFix = {};
for (const entityKey of Object.keys(entities)) {
  let entity = entities[entityKey];
  let entityEvents = entity.events;
  let newEvents = [];
  for (let eventKey of entityEvents) {
    if (events.hasOwnProperty(eventKey)) {
      newEvents.push(events[eventKey]);
    }
  }
  entity.events = newEvents;
  dataFix[entityKey] = entity;
}

/* 
cases:
  - multiple entities share the same event
  - entity has just one event
  - user want to draw just an event on the map
  - depict uncertainites in form of other shapes
*/

const meta: Meta = {
  component: TimelineIndiviDual,
  title: "Visualisations/Timeline",
};

export default meta;

export const Default: StoryObj = {
  args: {
    data: dataFix,
    width: 1000,
    height: 500,
    vertical: false,
  },
};

export const Vertical: StoryObj = {
  args: {
    ...Default.args,
    vertical: true,
  },
};

export const Single: StoryObj = {
  args: {
    ...Default.args,
    vertical: false,
    data: Object.fromEntries(Object.entries(dataFix).slice(1)),
  },
};

export const Thickness: StoryObj = {
  args: {
    ...Default.args,
    thickness: 1,
  },
};

export const Labels: StoryObj = {
  args: {
    ...Default.args,
    showLabels: false,
  },
};

/* export const Default = (args: JSX.IntrinsicAttributes): JSX.Element => {
  return <TimelineIndiviDual {...args} data={dataFix} />;
};

export const Vertical = (args: JSX.IntrinsicAttributes): JSX.Element => {
  return <TimelineIndiviDual {...args} data={dataFix} vertical={true} />;
};
 */
