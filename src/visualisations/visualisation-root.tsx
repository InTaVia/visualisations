import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import type { VisualisationDimensions } from '@/features/visualisations/use-visualisation-dimensions'

interface VisualisationRootProps {
  children: ReactNode
  dimensions: VisualisationDimensions
}

export const VisualisationRoot = forwardRef(function VisualisationRoot(
  props: VisualisationRootProps,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { children, dimensions } = props

  return (
    <div ref={ref} className="h-full w-full">
      <svg height={dimensions.height} width={dimensions.width}>
        <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>{children}</g>
      </svg>
    </div>
  )
})
