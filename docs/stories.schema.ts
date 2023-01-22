/**
 * Schema contract between story creator and story viewer.
 */

import type { EntityEvent } from '@intavia/api-client'

export interface Story {
  id: string
  title: string
  subtitle: string
  copyright: string
  language: string
  slides: Array<Slide>
}

export interface Slide {
  id: string
  title: string
  sort: number
  layout: 'con-con' | 'con' | 'title' | 'vis-con' | 'vis'
  visualisationPanes: Record<string, Visualisation>
  contentPanes: Record<string, ContentPane>
}

export const defaultStyles = {
  birthevent: { primary: '#92c5de', secondary: '#0571b0' },
  deathevent: { primary: '#ca0020', secondary: '#f4a582' },
  event: { primary: '#33a02c', secondary: '#b2df8a' },
}

export interface ContentPane {
  id: string
  contents: Array<ContentBase>
}

export interface ContentBase {
  id: string
  title: string
  sort: number
  type: '3DObject' | 'Audio' | 'Headline' | 'Image' | 'IndexSlide' | 'Quiz' | 'Text' | 'Video'
}

export interface Headline extends ContentBase {
  type: 'Headline'
  format: 'H1' | 'H2' | 'H3'
  alignment: 'center' | 'left' | 'right'
  text: string
}

export interface Text extends ContentBase {
  type: 'Text'
  text: string
}

export interface Image extends ContentBase {
  type: 'Text'
  url: string
  copyright: string
  caption: string
}

export interface Quiz extends ContentBase {
  type: 'Quiz'
  question: string
  answers: Array<QuizAnswer>
}

export interface QuizAnswer {
  html: string
  correct: boolean
}

export interface Visualisation {
  id: string
  type: 'Map' | 'Network' | 'Set' | 'Statistic' | 'Timeline' // rather meta types or the concrete types?
  highlighted: boolean
  entities: Array<unknown>
  events: Array<unknown>
}

export interface Map extends Visualisation {
  id: string
  type: 'Map'
  subtype: 'MarkerClusterMap' | 'TrajectoryMap'
}

export interface MarkerProperties {
  hidden: boolean
  size: number
  fill: string //color
  stroke: string //color
  shape: 'circle' | 'icon' | 'rectangle'
  icon?: string //from IconStore (AssetStore)
  coords: [number, number]
}

export interface MarkerClusterMap extends Map {
  subtype: 'MarkerClusterMap'
  clusterThemeAttribute: string | null // e.g. 'entity-kind'  | 'event-kind' | null for NO-clustering at all
  clusterType: 'beeswarm' | 'donut' | null
  highlighed?: Array<EntityEvent['id']>
  events: Array<EntityEvent>
}

export interface TrajectoryMap extends Map {
  id: string
  type: 'Map'
  subtype: 'TrajectoryMap'
  eventSorting: []
}

export interface Timeline extends Visualisation {
  id: string
  type: 'Timeline'
  subtype: 'DualTimeline' | 'GroupTimeline' | 'IndividualTimeline'
}

export interface IndividualTimeline extends Timeline {
  id: string
  subtype: 'IndividualTimeline'
  vertical: boolean
}

export interface DualTimeline extends Timeline {
  id: string
  subtype: 'DualTimeline'
  vertical: boolean
}

export interface GroupTimeline extends Timeline {
  id: string
  subtype: 'GroupTimeline'
  vertical: boolean
}
