import "maplibre-gl/dist/maplibre-gl.css";

import { extent } from "d3-array";
import { scaleBand, scaleTime } from "d3-scale";

import type { MapProps } from "react-map-gl";

import { useElementRef } from "@/lib/use-element-ref";
import { TimelineAxis } from "@/features/visualisations/timeline/timelineAxis";
import { TimelineEntity } from "@/features/visualisations/timeline/timelineEntity";

import { Entity, EntityEvent } from "@/api/intavia.models";

export type GeoMapProps = Omit<MapProps, "mapLib">;

export const TimelineIndiviDual = (props): JSX.Element => {
  const {
    data,
    width = 600,
    height = 300,
    vertical = false,
    thickness = 1,
    showLabels = true,
  } = props;

  const [element, setElement] = useElementRef();

  const timeDomain = getTemporalExtent(
    Object.values(data).map((entity: Entity) => {
      return entity?.events as Array<EntityEvent>;
    })
  );

  console.log(timeDomain, data);

  const padding = 50;

  const timeScale = scaleTime()
    .domain(timeDomain)
    .range([padding, (vertical ? height : width) - padding - 100]);

  const scaleY = scaleBand()
    .domain(
      Object.keys(data).map((id: string, i: number) => {
        return i;
      })
    )
    .range([50, (vertical ? width : height) - 50])
    .paddingInner(0.2);

  const dual = Object.keys(data).length > 1 ? true : false;

  return (
    <div
      draggable
      className="bg-teal-400 relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <TimelineAxis
        width={vertical ? padding : width}
        height={vertical ? height : padding}
        xScale={timeScale}
        timeDomain={timeDomain}
        vertical={vertical}
      />
      <svg
        width={width - (vertical ? padding : 0)}
        height={height - (vertical ? 0 : padding)}
      >
        {Object.values(data).map((entry: Entity, i: number) => {
          return (
            <TimelineEntity
              entity={entry}
              timeScale={timeScale}
              scaleY={scaleY}
              vertical={vertical}
              index={i}
              thickness={thickness}
              showLabels={showLabels}
            />
          );
        })}
      </svg>
    </div>
  );
};

export function getTemporalExtent(
  data: Array<Array<EntityEvent>>
): [Date, Date] {
  const dates: Array<Date> = [];

  data.forEach((entry) => {
    entry.forEach((event) => {
      if (event.startDate != null) {
        dates.push(new Date(event.startDate));
      }

      if (event.endDate != null) {
        dates.push(new Date(event.endDate));
      }
    });
  });

  // default: full (mock) time range
  if (dates.length === 0) {
    return [new Date(Date.UTC(1800, 0, 1)), new Date(Date.UTC(2020, 11, 31))];
  }

  // dates must contain only `Date`s here, and at least one
  return extent(dates) as [Date, Date];
}
