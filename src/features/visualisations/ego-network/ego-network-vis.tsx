import type { Entity, EntityRelationRole } from "@/api/intavia.models";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force";
import { useEffect, useState } from "react";

export interface EgoNetworkVisProps {
    nodes: Array<Node>;
    links: Array<Link>;
}

export interface Node {
  entity: Entity;
  x: number;
  y: number;
}

export interface Link {
    source: Node;
    target: Node;
    roles: Array<EntityRelationRole>;
}

export function EgoNetworkVis(props: EgoNetworkVisProps): JSX.Element {
  const {nodes, links} = props;

  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const [svgViewBox, setSvgViewBox] = useState("0 0 600 600");

  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const [animatedLinks, setAnimatedLinks] = useState(links);

  useEffect(() => {
    const simulation = forceSimulation(animatedNodes)
      .force('charge', forceManyBody().strength(-500))
      .force('link', forceLink(animatedLinks).distance(150))
      .force('center', forceCenter(width / 2, height / 2));

      simulation.alpha(0.1).restart();

      simulation.on('tick', () => {
        // Fix center
        simulation.nodes()[0]!.x = width / 2;
        simulation.nodes()[0]!.y = height / 2;

        setAnimatedNodes([...simulation.nodes()]);
        setAnimatedLinks([...animatedLinks]);
      });

      return () => {simulation.stop();}
  }, [nodes, links]);

  return (
    <svg viewBox={svgViewBox} width={width} height={height}>
      
      {animatedLinks.map((link) => (
        <g key={`${link.source.entity.id}-${link.target.entity.id}`}>  
          <line x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y} stroke="lightgray" />
        </g>
      ))}

      {animatedNodes.map((node) => (
        <NodeView {...node} key={node.entity.id} />
      ))}
    </svg>
  );
}

export function NodeView(props: Node): JSX.Element {
  const { entity, x, y } = props;

  const width = 15;
  const height = 15;

  const personFill = "#57AE5F";
  const objectFill = "#5785AE";
  const placeFill = "#AE5757";
  const groupFill = "#C6C6C6";
  const eventFill = "#A957AE";

  function renderPersonNode(): JSX.Element {
    // Draw circle with center at origin
    return (
        <circle r={width / 2} fill={personFill} />
    );
  }

  function renderObjectNode(): JSX.Element {
    // Draw square with center at origin
    return (
        <rect x={-width / 2} y={-height / 2} width={width} height={height} fill={objectFill} />
    );
  }

  function renderPlaceNode(): JSX.Element {
    // Draw triangle with center at origin
    const p = `${-width / 2},${height / 2} ${width / 2},${height / 2} 0,${-height / 2}`;
    return (
        <polygon fill={placeFill} points={p} />
    );
  }

  function renderGroupNode(): JSX.Element {
    // Draw ellipse with center at origin
    const rx = width * (5/ 7);
    const ry = height / 2;
    return (
        <ellipse rx={rx} ry={ry} fill={groupFill} />
    );
  }

  function renderEventNode(): JSX.Element {
    // Draw rhombus wijth center at origin
    const p = `${-width / 2},0 0,${height / 2} ${width / 2},0 0,${-height / 2}`;
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
          return renderEventNode();
        case "group":
          return renderGroupNode();
        case "historical-event":
          return renderEventNode();
      }
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
        {renderNode()}
        <text x={0} y={height + 12} textAnchor="middle" fill="black">{entity.label.default}</text>
    </g>
  )
}
