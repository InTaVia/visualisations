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

const dataFix = {
  "http://www.intavia.eu/apis/personproxy/147956": {
    id: "http://www.intavia.eu/apis/personproxy/147956",
    label: { default: "Sauer, Hedda" },
    source: { citation: "Austrian Biographical Dictionary" },
    linkedIds: [
      {
        id: "147956",
        provider: {
          label: "Österreichische Biographische Lexikon, APIS",
          baseUrl: "https://apis.acdh.oeaw.ac.at",
        },
      },
      {
        id: "116977477",
        provider: {
          label: "Gemeinsame Normdatei (GND)",
          baseUrl: "https://d-nb.info/gnd",
        },
      },
    ],
    kind: "person",
    events: [
      {
        id: "http://www.intavia.eu/apis/deathevent/147956",
        label: { default: "Death of Hedda Sauer" },
        endDate: "1953-03-21T23:59:59.000Z",
        place: {
          id: "http://www.intavia.eu/apis/place/14608",
          label: { default: "Prag" },
          geometry: { coordinates: [50.08804, 14.42076], type: "Point" },
          kind: "place",
        },
        relations: [
          {
            id: "http://www.intavia.eu/apis/personproxy/147956",
            label: { default: "Sauer, Hedda" },
            entity: {
              id: "http://www.intavia.eu/apis/personproxy/147956",
              label: { default: "Sauer, Hedda" },
              source: { citation: "Austrian Biographical Dictionary" },
              linkedIds: [
                {
                  id: "147956",
                  provider: {
                    label: "Österreichische Biographische Lexikon, APIS",
                    baseUrl: "https://apis.acdh.oeaw.ac.at",
                  },
                },
                {
                  id: "116977477",
                  provider: {
                    label: "Gemeinsame Normdatei (GND)",
                    baseUrl: "https://d-nb.info/gnd",
                  },
                },
              ],
              kind: "person",
            },
            role: {
              id: "http://www.intavia.eu/apis/deceased_person/147956",
            },
          },
        ],
      },
      {
        id: "http://www.intavia.eu/apis/birthevent/147956",
        label: { default: "Birth of Hedda Sauer" },
        startDate: "1875-09-24T00:00:00.000Z",
        place: {
          id: "http://www.intavia.eu/apis/place/14608",
          label: { default: "Prag" },
          geometry: { coordinates: [50.08804, 14.42076], type: "Point" },
          kind: "place",
        },
        relations: [
          {
            id: "http://www.intavia.eu/apis/personproxy/147956",
            label: { default: "Sauer, Hedda" },
            entity: {
              id: "http://www.intavia.eu/apis/personproxy/147956",
              label: { default: "Sauer, Hedda" },
              source: { citation: "Austrian Biographical Dictionary" },
              linkedIds: [
                {
                  id: "147956",
                  provider: {
                    label: "Österreichische Biographische Lexikon, APIS",
                    baseUrl: "https://apis.acdh.oeaw.ac.at",
                  },
                },
                {
                  id: "116977477",
                  provider: {
                    label: "Gemeinsame Normdatei (GND)",
                    baseUrl: "https://d-nb.info/gnd",
                  },
                },
              ],
              kind: "person",
            },
            role: { id: "http://www.intavia.eu/apis/born_person/147956" },
          },
        ],
      },
      {
        id: "http://www.intavia.eu/apis/event/personplace/147972",
        label: { default: "Sauer, Hedda wirkte in Prag" },
        place: {
          id: "http://www.intavia.eu/apis/place/14608",
          label: { default: "Prag" },
          geometry: { coordinates: [50.08804, 14.42076], type: "Point" },
          kind: "place",
        },
        relations: [
          {
            id: "http://www.intavia.eu/apis/personproxy/147956",
            label: { default: "Sauer, Hedda" },
            entity: {
              id: "http://www.intavia.eu/apis/personproxy/147956",
              label: { default: "Sauer, Hedda" },
              source: { citation: "Austrian Biographical Dictionary" },
              linkedIds: [
                {
                  id: "147956",
                  provider: {
                    label: "Österreichische Biographische Lexikon, APIS",
                    baseUrl: "https://apis.acdh.oeaw.ac.at",
                  },
                },
                {
                  id: "116977477",
                  provider: {
                    label: "Gemeinsame Normdatei (GND)",
                    baseUrl: "https://d-nb.info/gnd",
                  },
                },
              ],
              kind: "person",
            },
            role: {
              id: "http://www.intavia.eu/apis/personplace/eventrole/147972",
              label: { default: "wirkte in" },
            },
          },
        ],
      },
    ],
  },
  "http://www.intavia.eu/apis/personproxy/26697": {
    id: "http://www.intavia.eu/apis/personproxy/26697",
    label: { default: "Thornton, Jonathan" },
    source: { citation: "Austrian Biographical Dictionary" },
    linkedIds: [
      { id: "https://apis-edits.acdh-dev.oeaw.ac.at/entity/26697/" },
      {
        id: "26697",
        provider: {
          label: "Österreichische Biographische Lexikon, APIS",
          baseUrl: "https://apis.acdh.oeaw.ac.at",
        },
      },
    ],
    kind: "person",
    events: [
      {
        id: "http://www.intavia.eu/apis/deathevent/26697",
        label: { default: "Death of Jonathan Thornton" },
        endDate: "1847-12-31T23:59:59.000Z",
        place: {
          id: "http://www.intavia.eu/apis/place/3162",
          label: { default: "Klausenburg" },
          geometry: { coordinates: [46.76667, 23.6], type: "Point" },
          kind: "place",
        },
        relations: [
          {
            id: "http://www.intavia.eu/apis/personproxy/26697",
            label: { default: "Thornton, Jonathan" },
            entity: {
              id: "http://www.intavia.eu/apis/personproxy/26697",
              label: { default: "Thornton, Jonathan" },
              source: { citation: "Austrian Biographical Dictionary" },
              linkedIds: [
                {
                  id: "https://apis-edits.acdh-dev.oeaw.ac.at/entity/26697/",
                },
                {
                  id: "26697",
                  provider: {
                    label: "Österreichische Biographische Lexikon, APIS",
                    baseUrl: "https://apis.acdh.oeaw.ac.at",
                  },
                },
              ],
              kind: "person",
            },
            role: { id: "http://www.intavia.eu/apis/deceased_person/26697" },
          },
        ],
      },
      {
        id: "http://www.intavia.eu/apis/birthevent/26697",
        label: { default: "Birth of Jonathan Thornton" },
        startDate: "1776-01-01T00:00:00.000Z",
        place: {
          id: "http://www.intavia.eu/apis/place/3162",
          label: { default: "Klausenburg" },
          geometry: { coordinates: [46.76667, 23.6], type: "Point" },
          kind: "place",
        },
        relations: [
          {
            id: "http://www.intavia.eu/apis/personproxy/26697",
            label: { default: "Thornton, Jonathan" },
            entity: {
              id: "http://www.intavia.eu/apis/personproxy/26697",
              label: { default: "Thornton, Jonathan" },
              source: { citation: "Austrian Biographical Dictionary" },
              linkedIds: [
                {
                  id: "https://apis-edits.acdh-dev.oeaw.ac.at/entity/26697/",
                },
                {
                  id: "26697",
                  provider: {
                    label: "Österreichische Biographische Lexikon, APIS",
                    baseUrl: "https://apis.acdh.oeaw.ac.at",
                  },
                },
              ],
              kind: "person",
            },
            role: { id: "http://www.intavia.eu/apis/born_person/26697" },
          },
        ],
      },
    ],
  },
};
/* const config: Meta = {
    parameters: {
        actions: {
            argTypesRegex: "",
        },
    },
}; */

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
