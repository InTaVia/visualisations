import "maplibre-gl/dist/maplibre-gl.css";

import { forwardRef, useState } from "react";

import type { EntityEvent } from "@/api/intavia.models";

import { getTemporalExtent } from "@/features/visualisations/timeline/timeline";

type TimelineEventClusterProps = {
  id: string;
  events: Array<EntityEvent>;
  vertical: boolean;
  timeScale: (toBeScaled: Date) => number;
  scaleY: (toBeScaled: number) => number;
  midOffset: number;
  timeScaleOffset: number;
  entityIndex: number;
  thickness: number;
  showLabels: boolean;
  overlapIndex: number;
  overlap: boolean;
  clusterMode: "bee" | "pie" | "donut";
};

export const TimelineEventClusterBoundingBox = forwardRef(
  (props: TimelineEventClusterProps, ref): JSX.Element => {
    const {
      id,
      events,
      vertical = false,
      timeScale,
      scaleY,
      midOffset,
      timeScaleOffset,
      entityIndex,
      thickness,
      showLabels,
      overlapIndex,
      overlap = false,
      clusterMode,
    } = props;

    const [hover, setHover] = useState(false);

    let eventsExtent = getTemporalExtent([events]);
    const extentDiffInYears =
      eventsExtent[1].getUTCFullYear() - eventsExtent[0].getUTCFullYear();

    let textHeight = hover ? 12 : 10;
    //let diameter = (hover ? 10 + thickness : 7 + thickness) * 2;
    let diameter = (7 + thickness) * 2;

    let overlapOffset = overlapIndex >= 0 ? overlapIndex * diameter : 0;

    let posX = 0,
      posY = 0;
    let width = 0,
      height = 0;

    let midLineWidth = 0,
      midLineHeight = 0,
      midLinePosX = 0,
      midLinePosY = 0;

    if (vertical) {
      posY = timeScale(eventsExtent[0]) - timeScaleOffset;
      posX = midOffset + Math.floor(thickness / 2) - diameter / 2;
      height = timeScale(eventsExtent[1]) - timeScaleOffset - posY;
      width = diameter;
      /* posY = midOffset + Math.floor(thickness / 2) - diameter / 2;
        width = timeScale(eventsExtent[1]) - timeScaleOffset - posX;
        height = 20; */
      midLineWidth = width;
      midLineHeight = 1;
      midLinePosX = posX;
      midLinePosY = posY + height / 2;
    } else {
      posX = timeScale(eventsExtent[0]) - timeScaleOffset;
      posY = midOffset + Math.floor(thickness / 2) - diameter / 2;
      width = timeScale(eventsExtent[1]) - timeScaleOffset - posX;
      height = diameter;
      midLineWidth = 1;
      midLineHeight = height;
      midLinePosX = posX + width / 2;
      midLinePosY = posY;
    }

    return (
      <>
        <div
          style={{
            position: "absolute",
            left: posX,
            top: posY,
            fontSize: textHeight,
            width: `${width}px`,
            height: `${height}px`,
            fontWeight: hover ? "bold" : "unset",
            border: "red 1px solid",
            zIndex: hover ? 9999 : "unset",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: midLinePosX,
            top: midLinePosY,
            fontSize: textHeight,
            width: `${midLineWidth}px`,
            height: `${midLineHeight}px`,
            fontWeight: hover ? "bold" : "unset",
            backgroundColor: "lime",
            zIndex: hover ? 9999 : "unset",
          }}
        />
      </>
    );
  }
);
