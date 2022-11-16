import type { Entity, EntityKind, EntityRelationRole } from "@/api/intavia.models";
import type { InternationalizedLabel } from "@/api/intavia.types";
import { useState } from "react";

export interface EgoNetworkVisProps {
    centralEntity: Entity;
    nodes: Set<NodeProps>;
    links: Array<LinkProps>;
}

export interface NodeProps {
  entity: Entity;
  x: number;
  y: number;
}

export interface LinkProps {
    sourceEntityId: UriString;
    destinationEntityId: UriString;
    roles: Array<EntityRelationRole>;
}

export function EgoNetworkVis(props: EgoNetworkVisProps): JSX.Element {
  const {centralEntity, nodes, links} = props;
  
    const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const [svgViewBox, setSvgViewBox] = useState("0 0 600 600");

  return (
    <svg viewBox={svgViewBox} width={width} height={height}>
      {Array.from(nodes.values()).map((node) => (
        <Node {...node} />
      ))}
    </svg>
  );
}

export function Node(props: NodeProps): JSX.Element {
  const { entity, x, y } = props;

  const width = 15;
  const height = 15;

  const personFill = "#57AE5F";
  const objectFill = "#5785AE";
  const placeFill = "#AE5757";
  const groupFill = "#C6C6C6";
  const eventFill = "#A957AE";

  function renderPersonNode(): JSX.Element {
    return (
        <circle r={width} fill={personFill} />
    );
  }

  function renderObjectNode(): JSX.Element {
    return (
        <rect width={width} height={height} fill={objectFill} />
    );
  }

  function renderPlaceNode(): JSX.Element {
    const p = `0,${height} ${width},${height} ${width / 2},0`;
    return (
        <polygon fill={placeFill} points={p} />
    );
  }

  function renderGroupNode(): JSX.Element {
    const rx = width * (5 / 4);
    const ry = height * (3 / 4);
    return (
        <ellipse rx={rx} ry={ry} fill={groupFill} />
    );
  }

  function renderEventNode(): JSX.Element {
    const p = `0,${height / 2} ${width / 2},${height} ${width},${height / 2} ${width / 2},0`;
    return (
        <polygon fill={eventFill} points={p} />
    );
  }

  function renderNode(): JSX.Element {
    switch (entity.kind) {
        case "person":
          return renderPersonNode();
        case "cultural-heritage-object":
          return renderObjectNode();
        case "place":
          return renderPlaceNode();
        case "group":
          return renderGroupNode();
        case "historical-event":
          return renderEventNode();
      }
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
        {renderNode()}
        <text x={width / 2} y={height + 16} textAnchor="middle" fill="black">{entity.label.default}</text>
    </g>
  )
}
