import 'tailwindcss/tailwind.css'
import '~/config/storybook/preview.css'

import type { Parameters as StorybookParameters } from '@storybook/react'

export const parameters: StorybookParameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
