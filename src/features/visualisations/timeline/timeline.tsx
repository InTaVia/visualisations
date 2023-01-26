import "maplibre-gl/dist/maplibre-gl.css";

import { extent } from "d3-array";
import { scaleBand, scaleTime } from "d3-scale";

import type { MapProps } from "react-map-gl";

import { TimelineAxis } from "@/features/visualisations/timeline/timelineAxis";
import { TimelineEntity } from "@/features/visualisations/timeline/timelineEntity";
import { useElementRef } from "@/lib/use-element-ref";

import type { Entity, EntityEvent } from "@/api/intavia.models";
import { useEffect, useState } from "react";

export type GeoMapProps = Omit<MapProps, "mapLib">;

export const TimelineColors: Record<string, string> = {
  birth: "#3F88C5",
  death: "#D00000",
  personplace: "purple",
  default: "#88D18A",
};

export const replaceSpecialCharacters = (input: string) => {
  return input.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");
};

export const pick = (obj: Record<string, any>, keys: Array<string>) =>
  Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  );

interface LaneEntry {
  entity: Entity;
  events: Array<EntityEvent>;
  yIndex: number;
}

export type TimelineType = "default" | "dual" | "mass" | "single";

interface TimelineIndiviDualProps {
  entities: Record<string, Entity>;
  events: Record<string, EntityEvent>;
  width: number;
  height: number;
  amount: number;
  vertical: boolean;
  thickness: number;
  showLabels: boolean;
  overlap: boolean;
  cluster: boolean;
  clusterMode: "pie" | "donut" | "bee";
  nameFilter?: string;
  stackEntities: boolean;
  sortEntities: boolean;
  diameter?: number;
}

export const TimelineIndiviDual = (
  props: TimelineIndiviDualProps
): JSX.Element => {
  const {
    entities,
    events,
    width = 600,
    height = 300,
    amount = 100,
    vertical = false,
    thickness = 1,
    showLabels = true,
    overlap = false,
    cluster = false,
    clusterMode = "pie",
    nameFilter = null,
    stackEntities = false,
    sortEntities = false,
    diameter = 14,
  } = props;

  const [element, setElement] = useElementRef();

  const [unTimeableEvents, setUnTimeableEvents] = useState({});

  const [slicedData, setSlicedData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [unPlottableEntities, setUnPlottableEntities] = useState({});

  useEffect(() => {
    const tmpUnPlottableEntities = {} as Record<string, Entity>;
    const tmpUnTimeableEvents = {} as Record<string, EntityEvent>;
    const tmpSlicedData = Object.fromEntries(
      Object.entries(entities).slice(0, amount)
    );
    const tmpFilteredData = Object.fromEntries(
      Object.entries(tmpSlicedData).filter((keyValue) => {
        let entry = keyValue[1] as Entity;
        if (!entry?.events) {
          tmpUnPlottableEntities[entry.id] = entry;
          return false;
        } else {
          for (let eventId of entry?.events) {
            let event = events[eventId];
            if (event !== undefined) {
              if (!event.startDate && !event.endDate) {
                tmpUnTimeableEvents[event.id] = event;
              } else if (event.startDate && !event.endDate) {
                event.endDate = event.startDate;
              } else if (!event.startDate && event.endDate) {
                event.startDate = event.endDate;
              } else {
              }
            }
          }
          if (nameFilter != null && nameFilter.trim() !== "") {
            return entry!
              .label!.default.toLowerCase()
              .includes(nameFilter.toLowerCase());
          }
          return true;
        }
      })
    );

    setSlicedData(tmpSlicedData);
    setFilteredData(tmpFilteredData);
    setUnPlottableEntities(tmpUnPlottableEntities);
    setUnTimeableEvents(tmpUnTimeableEvents);
  }, [amount, entities, nameFilter]);

  const dual = Object.keys(slicedData).length > 1 ? true : false;

  const lanesData = (data: Array<Entity>) => {
    const lanesData: Array<LaneEntry> = [];
    let stack: Array<[Date, Date]> = [];
    data.forEach((entry: Entity) => {
      let entityEvents: Array<EntityEvent> =
        pickedEvents[entry.id] != undefined
          ? (pickedEvents[entry.id] as Array<EntityEvent>)
          : (Object.values(
              pick(events, entry.events != undefined ? entry.events : [])
            ) as Array<EntityEvent>);

      let entityExtent = getTemporalExtent([
        entityEvents as Array<EntityEvent>,
      ]);

      const lane = stack.findIndex(
        (s) =>
          timeScale(new Date(s[1])) <
            timeScale(new Date(entityExtent[0])) - diameter &&
          timeScale(new Date(s[0])) <
            timeScale(new Date(entityExtent[0])) - diameter
      );

      const yIndex =
        lane === -1 || stackEntities === false ? stack.length : lane;
      lanesData.push({
        entity: entry,
        events: entityEvents,
        yIndex: yIndex,
      } as LaneEntry);
      stack[yIndex] = entityExtent;
    });
    return { lanes: lanesData, numberOfLanes: stack.length };
  };

  let pickedEvents: Record<string, Array<EntityEvent>> = {};

  let sortedData: Array<Entity>;
  sortedData = (Object.values(filteredData) as Array<Entity>).sort(
    (a: Entity, b: Entity) => {
      let entityAEvents = Object.values(
        pick(events, a.events != undefined ? a.events : [])
      );
      let entityBEvents = Object.values(
        pick(events, b.events != undefined ? b.events : [])
      );

      pickedEvents[a.id] = entityAEvents;
      pickedEvents[b.id] = entityBEvents;

      let entityAExtent = getTemporalExtent([entityAEvents]);
      let entityBExtent = getTemporalExtent([entityBEvents]);

      if (sortEntities) {
        return (
          new Date(entityAExtent[0]).getTime() -
          new Date(entityBExtent[0]).getTime()
        );
      } else {
        return 1;
      }
    }
  );

  const timeDomain = getTemporalExtent(Object.values(pickedEvents));

  const padding = 50;

  const timeScale = scaleTime()
    .domain(timeDomain)
    .range([padding, (vertical ? height : width) - padding - 100]);

  const { lanes, numberOfLanes } = lanesData(sortedData);

  const startYValue = vertical ? 50 : 0;
  const maxYValue = vertical ? width : height - 50;

  const scaleY = scaleBand()
    // @ts-ignore
    .domain(Array.from(Array(numberOfLanes).keys()).reverse())
    .range([startYValue, maxYValue])
    .paddingInner(0.2)
    .padding(0.2);

  let mode: TimelineType = "default";
  if (Object.values(sortedData).length > 15) {
    mode = "mass";
  } else if (Object.values(sortedData).length === 2) {
    mode = "dual";
  } else if (Object.values(sortedData).length === 1) {
    mode = "single";
  }

  return (
    <>
      <div
        className="relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid gray",
        }}
        key={`timeline${amount}${vertical}`}
      >
        <TimelineAxis
          width={vertical ? padding : width}
          height={vertical ? height : padding}
          timeScale={timeScale}
          /* timeDomain={timeDomain} */
          vertical={vertical}
        />
        {lanes.map((entry: LaneEntry, i: number) => {
          let entityEvents = entry.events;
          return (
            <TimelineEntity
              key={`${entry.entity.id}${cluster}${clusterMode}${vertical}${mode}${diameter}${thickness}${showLabels}${sortEntities}${stackEntities}`}
              entity={entry.entity}
              events={entityEvents}
              timeScale={timeScale}
              scaleY={scaleY}
              vertical={vertical}
              index={entry.yIndex}
              thickness={mode === "mass" ? scaleY.bandwidth() : thickness}
              showLabels={
                Object.values(filteredData).length < 5 ? showLabels : false
              }
              overlap={overlap}
              cluster={cluster}
              clusterMode={clusterMode}
              mode={mode}
              diameter={mode === "mass" ? scaleY.bandwidth() : diameter}
            />
          );
        })}
      </div>
      <fieldset style={{ border: "1px solid gray" }}>
        <legend>Un-Plottable Entities</legend>
        {(Object.values(unPlottableEntities) as Array<Entity>).map(
          (entry: Entity) => {
            return (
              <div key={`${entry.id}unPlottableEntity`}>
                {entry.label.default}
              </div>
            );
          }
        )}
      </fieldset>
      <fieldset style={{ border: "1px solid gray" }}>
        <legend>Un-Timaable Events</legend>
        {(Object.values(unTimeableEvents) as Array<EntityEvent>).map(
          (entry: EntityEvent) => {
            return (
              <div key={`${entry.id}UnTimeableEvent`}>
                {entry.label.default}
              </div>
            );
          }
        )}
      </fieldset>
    </>
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
