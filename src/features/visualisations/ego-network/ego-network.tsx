import type { Entity } from "@/api/intavia.models";

export interface EgoNetworkProps {
    entity: Entity;
}

export function EgoNetworkVis(props: EgoNetworkProps): JSX.Element {
    return (
        <p>Hello World</p>
    );
}