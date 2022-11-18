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
  visualisationsPanes: Record<string, Visualisation>
  contentPanes: Record<string, ContentPane>
}

export const defaultStyles = {
  birthevent: { primary: '#92c5de', secondary: '#0571b0' },
  deathevent: { primary: '#ca0020', secondary: '#f4a582' },
  event: { primary: '#33a02c', secondary: '#b2df8a' },
}

export interface ContentPane {
  id: string
  contents: Array<Content>
}

export interface Content {
  id: string
  title: string
  sort: number
  type: '3DObject' | 'Audio' | 'Headline' | 'Image' | 'IndexSlide' | 'Quiz' | 'Text' | 'Video'
}

export interface Visualisation {
  id: string
  type: 'Map' | 'Network' | 'Set' | 'Statistic' | 'Timeline' // rather meta types or the concrete types?
  // data: Array<Record<EntityEvent['id'] | Entity['id'], Entity | EntityEvent>>;
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

/* defaultMarkerProperties {
  "DeathEvent": {hidden: false, fill: "purple"},
} */

export interface MarkerClusterMap extends Map {
  subtype: 'MarkerClusterMap'
  clusterThemeAttribute: string | null // e.g. 'entity-kind'  | 'event-kind' | null for NO-clustering at all
  clusterType: 'beeswarm' | 'donut' | null
  highlighed?: Array<EntityEvent['id']>
  events: Array<EntityEvent>
}

// Data Requirements
// Filter events: event-kind in ['birthevent', 'deathevent']
// eventTypes.some(e => ['birthevent', 'deathevent'].includes(e))
// id: 'ArmasMarkerClusterMap',
// type: 'Map',
// subtype: 'MarkerClusterMap',
// clusterType: 'donut',
// clusterThemeAttribute: 'event-kind',
// highlighed: ["http://www.intavia.eu/bs/birthevent/1000"],
// events: [
//   {
//       "id": "http://www.intavia.eu/bs/birthevent/1000",
//       "label": {
//         "default": "Birth of Taipale, Armas"
//       },
//       "startDate": "1890-07-27T00:00:00.000Z",
//       "endDate": "1890-07-27T23:59:59.000Z",
//       "place": {
//         "id": "http://www.intavia.eu/bs/place/1757",
//         "label": {
//           "default": "Hlsinki"
//         },
//         "geometry": {
//           "coordinates": [
//             60.1659,
//             24.989
//           ],
//           "type": "Point"
//         },
//         "kind": "place"
//       },
//       "relations": [
//         {
//           "id": "http://www.intavia.eu/bs/personproxy/1000",
//           "label": {
//             "default": "Taipale, Armas"
//           },
//           "entity": {
//             "id": "http://www.intavia.eu/bs/personproxy/1000",
//             "label": {
//               "default": "Taipale, Armas"
//             },
//             "linkedIds": [
//               {
//                 "id": "p1000",
//                 "provider": {
//                   "label": "BiographySampo",
//                   "baseUrl": "http://ldf.fi/nbf/"
//                 }
//               },
//               {
//                 "id": "Q679220",
//                 "provider": {
//                   "label": "Wikidata",
//                   "baseUrl": "http://www.wikidata.org/entity"
//                 }
//               }
//             ],
//             "gender": {
//               "id": "http://ldf.fi/schema/bioc/Male",
//               "label": {
//                 "default": "Male"
//               }
//             },
//             "kind": "person"
//           },
//           "role": {
//             "id": "http://www.intavia.eu/bs/born_person/1000"
//           }
//         }
//       ]
//     },
//    {
//       "id": "http://www.intavia.eu/bs/deathevent/1000",
//       "label": {
//         "default": "Death of Taipale, Armas"
//       },
//       "startDate": "1976-01-01T00:00:00.000Z",
//       "endDate": "1976-12-31T23:59:59.000Z",
//       "place": {
//         "id": "http://www.intavia.eu/bs/place/38511",
//         "label": {
//           "default": "Turku"
//         },
//         "geometry": {
//           "coordinates": [
//             60.4504,
//             22.2479
//           ],
//           "type": "Point"
//         },
//         "kind": "place"
//       },
//       "relations": [
//         {
//           "id": "http://www.intavia.eu/bs/personproxy/1000",
//           "label": {
//             "default": "Taipale, Armas"
//           },
//           "entity": {
//             "id": "http://www.intavia.eu/bs/personproxy/1000",
//             "label": {
//               "default": "Taipale, Armas"
//             },
//             "linkedIds": [
//               {
//                 "id": "p1000",
//                 "provider": {
//                   "label": "BiographySampo",
//                   "baseUrl": "http://ldf.fi/nbf/"
//                 }
//               },
//               {
//                 "id": "Q679220",
//                 "provider": {
//                   "label": "Wikidata",
//                   "baseUrl": "http://www.wikidata.org/entity"
//                 }
//               }
//             ],
//             "gender": {
//               "id": "http://ldf.fi/schema/bioc/Male",
//               "label": {
//                 "default": "Male"
//               }
//             },
//             "kind": "person"
//           },
//           "role": {
//             "id": "http://www.intavia.eu/bs/deceased_person/1000"
//           }
//         }
//       ]
//     }

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
