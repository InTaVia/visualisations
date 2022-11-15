import "maplibre-gl/dist/maplibre-gl.css";

import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { useRef, useEffect } from "react";

import type { MapProps } from "react-map-gl";

import { useElementRef } from "@/lib/use-element-ref";

import { Entity, EntityEvent } from "@/api/intavia.models";

import { getTemporalExtent } from "@/features/visualisations/timeline/timeline";
import { TimelineEvent } from "@/features/visualisations/timeline/timelineEvent";

export const TimelineEntity = (props): JSX.Element => {
  const {
    entity,
    vertical = false,
    timeScale,
    scaleY,
    index,
    thickness,
    showLabels,
  } = props;

  const entityExtent = getTemporalExtent([entity?.events]);

  let height = vertical
    ? timeScale(entityExtent[1]) - timeScale(entityExtent[0])
    : scaleY.bandwidth();

  let width = vertical
    ? scaleY.bandwidth()
    : timeScale(entityExtent[1]) - timeScale(entityExtent[0]);

  let midOffset = vertical ? (1 - index) * width : (1 - index) * height;

  return (
    <g
      transform={`translate(${
        vertical ? scaleY(index) : timeScale(entityExtent[0])
      } ${vertical ? timeScale(entityExtent[0]) : scaleY(index)})`}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"rgba(0, 100, 0, 0.5)"}
      />
      <rect
        x={vertical ? midOffset : 0}
        y={vertical ? 0 : midOffset}
        width={vertical ? thickness : width}
        height={vertical ? height : thickness}
        fill={"black"}
      />

      {entity?.events
        .filter((event) => {
          return event.startDate != null || event.endDate != null;
        })
        .map((event) => {
          return (
            <TimelineEvent
              vertical={vertical}
              timeScale={timeScale}
              timeScaleOffset={timeScale(entityExtent[0])}
              midOffset={midOffset}
              event={event}
              entityIndex={index}
              thickness={thickness}
              showLabels={showLabels}
            />
          );
        })}
    </g>
  );
};
