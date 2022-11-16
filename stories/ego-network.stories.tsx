import { EgoNetwork, type EgoNetworkProps } from "@/features/visualisations/ego-network/ego-network";
import type { Meta } from "@storybook/react";

const config: Meta = {
    component: EgoNetwork,
    title: 'Visualizations/EgoNetwork',
};

export default config;

export const Default = (args: JSX.IntrinsicAttributes & EgoNetworkProps): JSX.Element => {
    return <EgoNetwork {...args} />;
};