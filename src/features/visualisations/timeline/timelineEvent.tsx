import "maplibre-gl/dist/maplibre-gl.css";

import {
  getTemporalExtent,
  type TimelineType,
} from "@/features/visualisations/timeline/timeline";
import { forwardRef, useState } from "react";

import type { EntityEvent } from "@/api/intavia.models";

import { TimelineColors as colors } from "@/features/visualisations/timeline/timeline";
import { TimelineEventMarker } from "./timelineEventMarker";
import { TimelineLabel } from "./timelineLabel";

interface TimelineEventProps {
  id: string;
  event: EntityEvent;
  vertical?: boolean;
  timeScale: (toBeScaled: Date) => number;
  midOffset: number;
  timeScaleOffset: number;
  entityIndex: number;
  thickness?: number;
  showLabels: boolean;
  overlapIndex: number;
  overlap: boolean;
  mode?: TimelineType;
  diameter?: number;
}

export const TimelineEvent = forwardRef(
  (props: TimelineEventProps, ref): JSX.Element => {
    const {
      id,
      event,
      vertical = false,
      timeScale,
      midOffset,
      timeScaleOffset,
      entityIndex,
      thickness = 1,
      showLabels,
      overlapIndex,
      overlap = false,
      mode = "default",
      diameter = 16,
    } = props;

    const [hover, setHover] = useState(false);

    let eventExtent = getTemporalExtent([[event]]);
    const extentDiffInYears =
      eventExtent[1].getUTCFullYear() - eventExtent[0].getUTCFullYear();

    const diameterWithStroke = diameter + thickness * 3;

    let overlapOffset =
      overlapIndex >= 0 ? overlapIndex * diameterWithStroke : 0;

    let posX: number, posY: number;
    let color: string = "teal";
    let className = "timeline-event";

    // @ts-ignore
    color = colors[event.type] != null ? colors[event.type] : colors["default"];

    if (vertical) {
      posX = midOffset + Math.floor(thickness / 2) - overlapOffset;
      posY =
        timeScale(
          // @ts-ignore
          new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2
        ) - timeScaleOffset;
    } else {
      posX =
        timeScale(
          // @ts-ignore
          new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2
        ) - timeScaleOffset;
      posY = midOffset + Math.floor(thickness / 2) - overlapOffset;
    }

    let width, height;
    if (extentDiffInYears > 1 && (overlap || hover)) {
      if (vertical) {
        width = diameterWithStroke;
        height = timeScale(eventExtent[1]) - timeScale(eventExtent[0]);
        posX = posX - diameterWithStroke / 2;
        posY = timeScale(eventExtent[0]) - timeScaleOffset;
      } else {
        width = timeScale(eventExtent[1]) - timeScale(eventExtent[0]);
        height = diameterWithStroke;
        posX = timeScale(eventExtent[0]) - timeScaleOffset;
        posY = posY - diameterWithStroke / 2;
      }
      color = color;
    } else {
      width = diameterWithStroke;
      height = diameterWithStroke;
      posX = posX - diameterWithStroke / 2;
      posY = posY - diameterWithStroke / 2;
      className = className + " hover-animation";
    }

    //@ts-ignore TODO use real kind or type of event
    const eventType = event.type;

    return (
      <>
        <div
          id={id}
          //@ts-ignore
          ref={ref}
          style={{
            position: "absolute",
            left: posX,
            top: posY,
            width: `${width}px`,
            height: `${height}px`,
            cursor: "pointer",
          }}
          className={`${className}`}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <svg
            style={{ width: `${width}px`, height: `${height}px` }}
            width={width}
            height={height}
          >
            <TimelineEventMarker
              width={width}
              height={height}
              type={eventType}
              color={color}
              thickness={thickness}
            />
          </svg>
        </div>
        <TimelineLabel
          posX={posX + width / 2}
          posY={posY + height / 2}
          labelText={event.label.default}
          showLabels={showLabels}
          entityIndex={entityIndex}
          mode={mode}
          thickness={thickness}
          vertical={vertical}
        />
      </>
    );
  }
);
