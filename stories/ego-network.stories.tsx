import type { Entity, EntityEvent } from "@/api/intavia.models";
import { EgoNetwork, type EgoNetworkProps } from "@/features/visualisations/ego-network/ego-network";
import type { Meta } from "@storybook/react";

import entities020 from "./fixtures/entities-20.json";
import events020 from "./fixtures/events-20.json";

function getEventsForEntity(entity: Entity): Array<EntityEvent> {
    const events = Array<EntityEvent>();
    entity.events?.forEach((eventId: UriString) => {
        events.push(events020[eventId] as EntityEvent);
    });
    return events;
}

const config: Meta = {
    component: EgoNetwork,
    title: 'Visualizations/EgoNetwork',
};

export default config;

export const Default = (args: JSX.IntrinsicAttributes & EgoNetworkProps): JSX.Element => {
    return <EgoNetwork {...args}
    entity={entities020['http://www.intavia.eu/apis/personproxy/26740'] as Entity}
    getEventsForEntity={getEventsForEntity}
    />;
};