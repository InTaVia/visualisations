/** @typedef {import('@storybook/react/types').StorybookConfig} StorybookConfig */

/** @type {StorybookConfig} */
const config = {
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: "webpack5",
  },
  framework: "@storybook/react",
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
};

module.exports = config;
