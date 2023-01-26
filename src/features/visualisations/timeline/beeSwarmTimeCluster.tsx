import type { EntityEvent } from "@/api/intavia.models";
import {
  getTemporalExtent,
  TimelineColors as colors,
} from "@/features/visualisations/timeline/timeline";
import { scaleTime } from "d3-scale";
// @ts-ignore
import { extent } from "d3-array";
// @ts-ignore
import { beeswarm } from "d3-beeswarm";
import { forwardRef, type LegacyRef } from "react";
import { TimelineEventMarker } from "./TimelineEventMarker";

interface Bee {
  x: number;
  y: number;
  datum: {
    type: string;
  };
}

interface BeeSwarmProperties {
  events: Array<EntityEvent>;
  width: number;
  height: number;
  vertical: boolean;
  dotRadius?: number;
}

export const BeeSwarm = forwardRef(
  (props: BeeSwarmProperties, ref): JSX.Element => {
    const { events, width, vertical, dotRadius = 5 } = props;

    const eventsExtent = getTemporalExtent([events]);

    const beeScale = scaleTime().domain(eventsExtent).range([0, width]);

    let swarm = beeswarm()
      .data(events) // set the data to arrange
      .distributeOn(function (d: EntityEvent) {
        let val = beeScale(
          // @ts-ignore
          new Date(
            new Date(d.startDate ? d.startDate : "").getTime() +
              new Date(d.endDate ? d.endDate : "").getTime()
          ) / 2
        );
        // set the value accessor to distribute on
        return val;
      }) // when starting the arrangement
      .radius(dotRadius) // set the radius for overlapping detection
      .orientation(vertical ? "vertical" : "horizontal") // set the orientation of the arrangement
      .side("symetric") // set the side(s) available for accumulation
      .arrange();

    let yExtent = extent(
      swarm.map((bee: Bee) => {
        return bee.y;
      })
    );

    let xExtent = extent(
      swarm.map((bee: Bee) => {
        return bee.x;
      })
    );

    // @ts-ignore
    let xDiff = xExtent[1] - xExtent[0] + dotRadius * 2;
    // @ts-ignore
    let yDiff = yExtent[1] - yExtent[0] + dotRadius * 2;

    // @ts-ignore
    let x0 = xExtent[0] - dotRadius;
    // @ts-ignore
    let y0 = yExtent[0] - dotRadius;

    return (
      <svg
        ref={ref as LegacyRef<SVGSVGElement>}
        width={`${xDiff}`}
        viewBox={`${x0} ${y0} ${xDiff} ${yDiff}`}
        textAnchor="middle"
        height={`${yDiff}`}
      >
        {swarm.map((dot: Bee) => {
          return (
            <g
              key={`${JSON.stringify(dot.datum)}TimelineClusterEventMarker`}
              transform={`translate(${dot.x - dotRadius} ${dot.y - dotRadius})`}
            >
              <TimelineEventMarker
                width={dotRadius * 2}
                height={dotRadius * 2}
                type={dot.datum.type}
                // @ts-ignore
                color={colors[dot.datum.type]}
                thickness={1}
              />
            </g>
          );
        })}
      </svg>
    );
  }
);
