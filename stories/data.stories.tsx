import entities100 from "./fixtures/entities-100.json";

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
const meta = {};

export default meta;

export const Test = () => {
  return <DataView entities={entities100} />;
};
