import type { Entity, EntityKind } from "@/api/intavia.models";
import type { InternationalizedLabel } from "@/api/intavia.types";

export interface EgoNetworkProps {
    centralEntity: Entity;
}

interface NodeProps {
    entityId: UriString;
    kind: EntityKind;
    label: InternationalizedLabel;
}

export function EgoNetwork(props: EgoNetworkProps): JSX.Element {
    return (
        <div className="w-full h-full">
            <svg>
                <Node entityId="0" kind="person" label={{default: 'Klimt'}}/>
            </svg>
        </div>
    );
}

export function Node(props: NodeProps): JSX.Element {
    const {entityId, kind, label} = props;

    const width = 50;
    const height = 50;

    const personFill = '#57AE5F';
    const objectFill = '#5785AE';
    const placeFill = '#AE5757';
    const groupFill = '#C6C6C6';
    const eventFill = '#A957AE';
    
    function renderPersonNode(): JSX.Element {
        return (
            <g>
                <circle r={width} cx={0} cy={0} fill={personFill} />
            </g>
        )
    }

    function renderObjectNode(): JSX.Element {
        return (
            <g>
                <rect />
            </g>
        )
    }

    function renderPlaceNode(): JSX.Element {
        return (
            <g>
                <polygon />
            </g>
        )
    }

    function renderGroupNode(): JSX.Element {
        return (
            <g>
                <ellipse />
            </g>
        )
    }

    function renderEventNode(): JSX.Element {
        return (
            <g>
                <polygon />
            </g>
        )
    }

    switch (kind) {
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
        default:
            return <p>{kind} not supported</p>
    }
    
}