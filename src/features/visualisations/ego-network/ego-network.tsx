import type { Entity, EntityEvent } from "@/api/intavia.models";
import { useEffect, useState } from "react";
import { EgoNetworkVis, type LinkProps, type NodeProps } from "./ego-network-vis";

export interface EgoNetworkProps {
  entity: Entity;
  getEventsForEntity: (entity: Entity) => Array<EntityEvent>;
}

export function EgoNetwork(props: EgoNetworkProps): JSX.Element {
  const { entity, getEventsForEntity } = props;
  const [nodes, setNodes] = useState<Set<NodeProps>>(new Set<NodeProps>());
  const [links, setLinks] = useState<Array<LinkProps>>(new Array<LinkProps>());

  function extractNodesAndLinksFromEvents(events: Array<EntityEvent>) {
    let relatedNodes = new Set<NodeProps>();
    let relations = new Array<LinkProps>();

    events.forEach((event, idx) => {
      // Place
      if (event.place) {
        console.log(`Event takes place in ${event.place.label.default}`);

        const node = {
          entity: event.place,
          x: 100,
          y: idx * 50,
        };

        if (relatedNodes.has(node)) {
          // Node already exists, update link
          let relation = relations.find((relation: LinkProps) => {
            return (
              relation.sourceEntityId === entity.id &&
              relation.destinationEntityId === event.place?.id
            );
          });
          if (relation && event.relations[0] && event.relations[0].role) {
            relation.roles.push(event.relations[0].role);
          }
        } else {
          // Node doesn't exist yet, create new node and link
          relatedNodes.add(node);
          relations.push({
            sourceEntityId: entity.id,
            destinationEntityId: event.place.id,
            roles:
              event.relations[0] && event.relations[0].role
                ? [event.relations[0].role]
                : [],
          });
        }
      }

      // Relations
      // TODO: create nodes and links for relations
    });

    setNodes(relatedNodes);
    setLinks(relations);

  }

  useEffect(() => {
    // TODO: This might have to be adapted to work in the application
    const events = getEventsForEntity(entity);
    extractNodesAndLinksFromEvents(events);
  }, []);

  console.log(nodes);
  console.log(links);

  return (
    <div className="w-full h-full">
      {nodes && links && (
        <EgoNetworkVis
          centralEntity={entity}
          nodes={nodes}
          links={links}
        />
      )}
    </div>
  );
}
