<<<<<<< HEAD
import type { Meta } from "@storybook/react";
import { Fragment } from "react";

=======
>>>>>>> 2810792 (control for fixtures (1,2,20,100))
import entities001 from "./fixtures/entities-1.json";
import entities002 from "./fixtures/entities-2.json";
import entities020 from "./fixtures/entities-20.json";
import entities100 from "./fixtures/entities-100.json";

<<<<<<< HEAD
import events001 from "./fixtures/events-1.json";
import events002 from "./fixtures/events-2.json";
import events020 from "./fixtures/events-20.json";
import events100 from "./fixtures/events-100.json";


=======
>>>>>>> 2810792 (control for fixtures (1,2,20,100))
const entityGroups = {
  1: entities001,
  2: entities002,
  20: entities020,
  100: entities100
}

<<<<<<< HEAD
const eventsForEntityGroups = {
  1: events001,
  2: events002,
  20: events020,
  100: events100
}

=======
>>>>>>> 2810792 (control for fixtures (1,2,20,100))
interface DataViewProps {
  data: Record<string, Record<string, any>>
}

function DataView(props: DataViewProps): JSX.Element {
  const { data } = props;

  return (
    <ul role="list">
      {Object.values(data).map((entry) => {
        return (
          <Fragment key={entry['id']}>
          <li>
            <strong><pre>{entry['id']}</pre></strong>
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
<<<<<<< HEAD
const config: Meta = {
  title: 'Data/Data',
=======
const meta = {
>>>>>>> 2810792 (control for fixtures (1,2,20,100))
  argTypes: {
    entitiesCount: { control: { type: "select", options: Object.keys(entityGroups)}, defaultValue: Object.keys(entityGroups).at(-1),},
  },
};

<<<<<<< HEAD
export default config;

export const EntityData = (args: any) => {
  return <DataView data={entityGroups[args.entitiesCount as number] as DataViewProps["data"]} />;
};

export const EventData = (args: any) => {
  return <DataView data={eventsForEntityGroups[args.entitiesCount as number] as DataViewProps["data"]}/>;
=======
export default meta;

export const Data = (args: any) => {
  return <DataView entities={entityGroups[args.entitiesCount as number] as DataViewProps["entities"]} />;
>>>>>>> 2810792 (control for fixtures (1,2,20,100))
};
