import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
  docs: {
    docsPage: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../../public/'],
  stories: ['../../@(src|stories)/**/*.stories.mdx', '../../@(src|stories)/**/*.stories.@(ts|tsx)'],
}

export default config
