/** @typedef {import('@storybook/react/types').StorybookConfig} StorybookConfig */

const path = require("path")

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
  webpackFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), 'src'),
      '~': process.cwd(),
    };

    /**
     * We add the postcss loader manually instead of using `@storybook/addon-postcss`,
     * so it correctly handles tsconfig paths via `resolve.alias`.
     */
     const cssRule = config.module?.rules?.find((rule) => {
      if (typeof rule === 'string') return false;
      if (!(rule.test instanceof RegExp)) return false;
      return rule.test.test('filename.css');
    });

    if (cssRule != null && typeof cssRule !== 'string' && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: 'postcss-loader',
        options: {
          implementation: require('postcss'),
        },
      });
    }
    
    return config;
  }
};

module.exports = config;
