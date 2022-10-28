import entities100 from "./fixtures/entities-100.json";

function Visualisation(props: VisualisationProps): JSX.Element {
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

const meta = {};

export default meta;

export const Test = () => {
  return <Visualisation entities={entities100} />;
};
