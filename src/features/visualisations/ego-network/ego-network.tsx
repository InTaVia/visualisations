import type { Entity, EntityEvent } from "@/api/intavia.models";
import { useEffect, useState } from "react";
import { EgoNetworkVis, type Link, type Node } from "./ego-network-vis";

export interface EgoNetworkProps {
  entity: Entity;
  getEventsForEntity: (entity: Entity) => Array<EntityEvent>;
}

export function EgoNetwork(props: EgoNetworkProps): JSX.Element {
  const { entity, getEventsForEntity } = props;
  const [nodes, setNodes] = useState<Array<Node>>(new Array<Node>());
  const [links, setLinks] = useState<Array<Link>>(new Array<Link>());

  function extractNodesAndLinksFromEvents(events: Array<EntityEvent>) {
    let relatedNodes = new Array<Node>();
    let relations = new Array<Link>();

    // Add central entity to node array
    relatedNodes.push({
      entity: entity,
      x: 0,
      y: 0
    });

    events.forEach((event, idx) => {
      // Place
      if (event.place) {
        const newNode = {
          entity: event.place,
          x: 0,
          y: 0,
        };

        if (relatedNodes.find((node) => {return node.entity.id === newNode.entity.id})) {
          // Node already exists, update link
          let relation = relations.find((relation: Link) => {
            return (
              relation.source.entity.id === entity.id &&
              relation.target.entity.id === event.place?.id
            );
          });
          if (relation && event.relations[0] && event.relations[0].role) {
            relation.roles.push(event.relations[0].role);
          }
        } else {
          // Node doesn't exist yet, create new node and link
          relatedNodes.push(newNode);
          relations.push({
            source: relatedNodes[0]!,
            target: newNode,
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

  return (
    <div className="w-full h-full">
      {nodes && links && nodes.length > 0 && links.length > 0 && (
        <EgoNetworkVis
          nodes={nodes}
          links={links}
        />
      )}
    </div>
  );
}
