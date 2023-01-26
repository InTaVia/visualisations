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

import entities from "./fixtures/entities-100.json";
import events from "./fixtures/events-100.json";

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
  argTypes: {
    entities: {
      table: {
        disable: true,
      },
    },
    events: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    entities: entities,
    events: events,
    width: 1000,
    height: 500,
    vertical: false,
    amount: 100,
    diameter: 14,
    nameFilter: "",
    stackEntities: false,
    sortEntities: false,
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
    cluster: false,
    amount: 1,
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

export const Overlap: StoryObj = {
  args: {
    ...Default.args,
    overlap: true,
  },
};

export const Cluster: StoryObj = {
  args: {
    ...Default.args,
    cluster: true,
    clusterMode: "pie",
    overlap: false,
  },
};

/* export const Default = (args: JSX.IntrinsicAttributes): JSX.Element => {
  return <TimelineIndiviDual {...args} data={dataFix} />;
};

export const Vertical = (args: JSX.IntrinsicAttributes): JSX.Element => {
  return <TimelineIndiviDual {...args} data={dataFix} vertical={true} />;
};
 */
