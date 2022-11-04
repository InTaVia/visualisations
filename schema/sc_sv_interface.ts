export interface Story{
    id: string;
    title: string;
    subtitle: string;
    copyright: string;
    language: string;
    slides: Array<Slide>;
}

export interface Slide {
    id: string;
    title: string;
    sort: number;
    visualizationsPanes: Record<string, Visualization>;
    contentPanes: Record<string, ContentPane>;
}

export interface Style {

}

export interface DefaultStyle {
    'birthEvent': {fill: , stroke:,}
}

export interface CustomStyle {
}

export interface ContentPane {
    id: string;
    contents: Array<Content>;
}

export interface Content {
    id: string;
    title: string;
    sort: number;
    type: 'Headline' | 'Text' | 'Image' | 'Video' | 'Audio' | '3DObject' | 'Quiz' | 'IndexSlide';
}

export interface Visualization {
    id: string;
    type: 'Map' | 'Timeline' | 'Network' | 'Set' | 'Statistic' //rather meta types or the concrete types?
    data: Array<Record<EntityEvent['id'] | Entity['id'], Entity | EntityEvent>>;
    highlighted: boolean
}

export interface Map extends Visualization {
    id: string;
    type: 'Map';
    subtype:  'MarkerClusterMap' | 'TrajectoryMap';
}

export interface MarkerClusterMap extends Map {
    id: string;
    type: 'Map';
    subtype: 'MarkerClusterMap';
    clusterThemeAttribute: string;
    featureStyle: {},
    beeswarmStyle: {},
    clusterStyle: {},
}

export interface TrajectoryMap extends Map {
    id: string;
    type: 'Map';
    subtype: 'TrajectoryMap';
    eventSorting: [];
}

export interface Timeline extends Visualization {
    id: string;
    type: 'Timeline';
    subtype: 'IndividualTimeline' | 'DualTimeline' | 'GroupTimeline';
}

export interface IndividualTimeline extends Timeline {
    id: string;
    subtype: "IndividualTimeline";
    vertical: boolean;
    
}

export interface DualTimeline extends Timeline {
    id: string;
    subtype: "DualTimeline";
    vertical: boolean;

}