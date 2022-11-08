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

interface DataViewProps {
  entities: Record<string, Record<string, any>>
}

function DataView(props: DataViewProps): JSX.Element {
  const { entities } = props;

  return (
    <ul role="list">
      {Object.values(entities).map((entity) => {
        return (
          <li key={entity.id}>
            <pre>{JSON.stringify(entity, null, 2)}</pre>
          </li>
        );
      })}
    </ul>
  );
}

// TODO: make control to select different fixtures
const meta = {
  argTypes: {
    entitiesCount: { control: { type: "select", options: Object.keys(entityGroups)}, defaultValue: Object.keys(entityGroups).at(-1),},
  },
};

export default meta;

export const Data = (args: any) => {
  return <DataView entities={entityGroups[args.entitiesCount as number] as DataViewProps["entities"]} />;
};
