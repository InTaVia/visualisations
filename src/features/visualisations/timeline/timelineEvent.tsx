import "maplibre-gl/dist/maplibre-gl.css";

import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { useRef, useEffect, useState } from "react";

import type { MapProps } from "react-map-gl";

import { useElementRef } from "@/lib/use-element-ref";

import { Entity, EntityEvent } from "@/api/intavia.models";

import { getTemporalExtent } from "@/features/visualisations/timeline/timeline";

export const TimelineEvent = (props): JSX.Element => {
  const {
    event,
    vertical = false,
    timeScale,
    scaleY,
    midOffset,
    timeScaleOffset,
    entityIndex,
    thickness,
    showLabels,
  } = props;

  const textOffset = entityIndex > 0 ? 10 + thickness : -10 - thickness;
  let eventExtent = getTemporalExtent([[event]]);
  console.log(eventExtent);

  let posX = vertical
    ? midOffset + Math.floor(thickness / 2)
    : timeScale(new Date(eventExtent[0])) - timeScaleOffset;
  let posY = vertical
    ? timeScale(new Date(eventExtent[0])) - timeScaleOffset
    : midOffset + Math.floor(thickness / 2);

  let textHeight = 14;

  let textPosX = vertical ? posX + textOffset : posX + textOffset;
  let textPosY = vertical ? posY + textHeight / 2 : posY + textOffset;

  /* let textAngle = vertical ? 0 : 45 * ((2 - entityIndex) * entityIndex); */
  let textAngle = entityIndex > 0 ? 45 : -45;

  let textAnchor = vertical
    ? entityIndex > 0
      ? "start"
      : "end"
    : entityIndex > 0
    ? "start"
    : "start";

  const [hover, setHover] = useState(false);

  return (
    <>
      <circle
        onMouseMove={() => {
          console.log(event);
        }}
        cx={posX}
        cy={posY}
        r={hover ? 10 + thickness : 7 + thickness}
        fill={"teal"}
        stroke={"black"}
        strokeWidth={hover ? 2 : 1}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        className={`cursor-pointer`}
      />
      <text
        fontSize={textHeight}
        text-anchor={textAnchor}
        transform={`translate(${textPosX}, ${textPosY}) rotate(${textAngle}) scale(${
          hover ? 1.15 : 1
        })`}
        className={`${showLabels || hover ? "visible" : "invisible"}`}
      >
        {event.label.default}
      </text>
    </>
  );
};
