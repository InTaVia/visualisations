import type { Meta } from "@storybook/react";
import { Fragment } from "react";

import entities001 from "./fixtures/entities-1.json";
import entities002 from "./fixtures/entities-2.json";
import entities020 from "./fixtures/entities-20.json";
import entities100 from "./fixtures/entities-100.json";

import events001 from "./fixtures/events-1.json";
import events002 from "./fixtures/events-2.json";
import events020 from "./fixtures/events-20.json";
import events100 from "./fixtures/events-100.json";

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

interface DataViewProps {
  data: Record<string, Record<string, any>>;
}

function DataView(props: DataViewProps): JSX.Element {
  const { data } = props;

  return (
    <ul role="list">
      {Object.values(data).map((entry) => {
        return (
          <Fragment key={entry["id"]}>
            <li>
              <strong>
                <pre>{entry["id"]}</pre>
              </strong>
            </li>
            <li>
              <pre>{JSON.stringify(entry, null, 2)}</pre>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}

// TODO: make control to select different fixtures
const config: Meta = {
  title: "Data/Data",
  argTypes: {
    entitiesCount: {
      control: { type: "select", options: Object.keys(entityGroups) },
      defaultValue: Object.keys(entityGroups).at(-1),
    },
  },
};

export default config;

export const EntityData = (args: any) => {
  return (
    <DataView
      data={entityGroups[args.entitiesCount as number] as DataViewProps["data"]}
    />
  );
};

export const EventData = (args: any) => {
  return (
    <DataView
      data={
        eventsForEntityGroups[
          args.entitiesCount as number
        ] as DataViewProps["data"]
      }
    />
  );
};
