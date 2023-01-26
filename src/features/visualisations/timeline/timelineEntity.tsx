import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";

import type { Entity, EntityEvent } from "@/api/intavia.models";
import {
  getTemporalExtent,
  replaceSpecialCharacters,
  TimelineColors as colors,
  type TimelineType,
} from "@/features/visualisations/timeline/timeline";
import { TimelineEvent } from "@/features/visualisations/timeline/timelineEvent";
import type { ScaleBand } from "d3-scale";
import { TimelineEventCluster } from "./timelineEventCluster";

const eventTypes = ["death", "birth", "personplace"];

interface TimelineEntityProps {
  entity: Entity;
  events: Array<EntityEvent>;
  vertical: boolean;
  timeScale: (data: Date) => number;
  scaleY: ScaleBand<string>;
  index: number;
  thickness: number;
  showLabels: boolean;
  overlap: boolean;
  cluster: boolean;
  clusterMode: "pie" | "donut" | "bee";
  mode?: TimelineType;
  diameter?: number;
}

export const TimelineEntity = (props: TimelineEntityProps): JSX.Element => {
  const {
    entity,
    events,
    vertical = false,
    timeScale,
    scaleY,
    index,
    thickness = 1,
    showLabels,
    overlap = false,
    cluster = false,
    clusterMode,
    mode = "default",
    diameter = 14,
  } = props;

  const itemsRef = useRef([]);
  const ref = useRef();
  const [overlapping, setOverlapping] = useState([]);
  const [clusterArray, setClusterArray] = useState([] as Array<Set<string>>);

  let tmpInitEventsWithoutCluster = {} as Record<string, EntityEvent>;
  for (let event of events) {
    // @ts-ignore
    // TODO check how to state the type of event
    event.type =
      eventTypes.find((e) => {
        return event.id.includes(e);
      }) ?? "default";
    tmpInitEventsWithoutCluster[event.id] = event;
  }

  const [eventsWithoutCluster, setEventsWithoutCluster] = useState(
    tmpInitEventsWithoutCluster
  );
  const [clusteredEvents, setClusteredEvents] = useState(
    [] as Array<Array<EntityEvent>>
  );

  const entityExtent = getTemporalExtent([events]);

  let height = vertical
    ? timeScale(entityExtent[1]) - timeScale(entityExtent[0])
    : diameter;

  let width = vertical
    ? diameter
    : timeScale(entityExtent[1]) - timeScale(entityExtent[0]);

  let midOffset = 0;
  if (vertical) {
    if (mode === "dual") {
      midOffset = index * scaleY.bandwidth();
    } else if (mode === "single") {
      midOffset = 0;
    } else {
      midOffset = 0;
    }
  } else {
    if (mode === "dual") {
      midOffset = index * scaleY.bandwidth();
    } else if (mode === "single") {
      midOffset = scaleY.bandwidth();
    } else {
      midOffset = scaleY.bandwidth();
    }
  }

  const dateRangeOverlaps = (
    startDateA: Date,
    endDateA: Date,
    startDateB: Date,
    endDateB: Date
  ) => {
    if (endDateA < startDateB || startDateA > endDateB) {
      return null;
    }

    var obj = {} as { startDate: Date; endDate: Date };
    obj.startDate = startDateA <= startDateB ? startDateB : startDateA;
    obj.endDate = endDateA <= endDateB ? endDateA : endDateB;

    return obj;
  };

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, events.length);

    let tmpEventsWithoutCluster = {} as Record<string, EntityEvent>;
    for (let event of events) {
      tmpEventsWithoutCluster[event.id] = event;
    }
    setEventsWithoutCluster(tmpEventsWithoutCluster);
  }, [entity, events]);

  useEffect(() => {
    if (!itemsRef || !ref || !cluster) {
      return;
    }

    let callback = (entries: any, observer: any) => {
      if (cluster) {
        let tmpClusterArray = [...clusterArray] as Array<Set<string>>;
        entries.forEach((entry: any, index: any) => {
          if (!entry.isIntersecting) {
            return;
          }
          entries.forEach((otherEntry: any, otherIndex: any) => {
            if (otherIndex >= index) {
              return;
            }

            const domRect1 = entry.boundingClientRect;
            const domRect2 = otherEntry.boundingClientRect;

            const noOverlap =
              domRect1.top > domRect2.bottom ||
              domRect1.right < domRect2.left ||
              domRect1.bottom < domRect2.top ||
              domRect1.left > domRect2.right;

            if (!noOverlap) {
              let id = entry.target.id;
              let otherId = otherEntry.target.id;

              let hit = false;
              for (let cluster of tmpClusterArray) {
                if (!cluster.has(id)) {
                  if (cluster.has(otherId)) {
                    cluster.add(id);
                    hit = true;
                  }
                } else {
                  if (!cluster.has(otherId)) {
                    cluster.add(otherId);
                  }
                  hit = true;
                }
              }

              if (!hit) {
                tmpClusterArray.push(new Set([id, otherId]));
              }
            }
          });
        });
        setClusterArray(tmpClusterArray);
      }
    };

    if (cluster) {
      // @ts-ignore
      let io = new IntersectionObserver(callback, { root: ref.current });

      itemsRef.current.forEach((target) => {
        if (target) io.observe(target);
      });

      return () => {
        itemsRef.current.forEach((target) => {
          if (target) io.unobserve(target);
        });
      };
    }
  }, [cluster]);

  useEffect(() => {
    let tmpEventsWithoutCluster = {} as Record<string, EntityEvent>;
    let tmpClusteredEvents = [...clusteredEvents] as Array<Array<EntityEvent>>;

    for (let event of Object.values(eventsWithoutCluster)) {
      let id = `${event.id}`;

      let hit = false;
      for (let idx in clusterArray) {
        let cluster = clusterArray[idx];
        if (cluster != undefined && cluster.has(id)) {
          hit = true;

          if (idx in tmpClusteredEvents) {
            //@ts-ignore
            tmpClusteredEvents[idx].push(event);
          } else {
            tmpClusteredEvents[idx] = [event];
          }
        }
      }

      if (hit === false) {
        tmpEventsWithoutCluster[event.id] = event;
      }
    }

    if (cluster) {
      setEventsWithoutCluster(tmpEventsWithoutCluster);
      setClusteredEvents(tmpClusteredEvents);
    } else {
      let tmpInitEventsWithoutCluster = {} as Record<string, EntityEvent>;
      for (let event of events) {
        tmpInitEventsWithoutCluster[event.id] = event;
      }
      setEventsWithoutCluster(tmpInitEventsWithoutCluster);
      setClusteredEvents([]);
    }
  }, [clusterArray, cluster]);

  // @ts-ignore
  let y = scaleY(index) ?? 0;

  return (
    <div
      //@ts-ignore
      ref={ref}
      key={replaceSpecialCharacters(
        `${entity.id}Entity${cluster}${clusterMode}${vertical}`
      )}
      style={{
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        left: vertical
          ? y + (mode === "mass" ? 0 : diameter / 2)
          : timeScale(entityExtent[0]),
        top: vertical
          ? timeScale(entityExtent[0])
          : y - (mode === "mass" ? thickness : diameter / 2),
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            left: vertical ? midOffset : 0,
            top: vertical ? 0 : midOffset,
            width: `${vertical ? thickness : width}px`,
            height: `${vertical ? height : thickness}px`,
            backgroundColor: mode === "mass" ? colors["birth"] : "black",
            position: "absolute",
          }}
        />
      </div>
      {mode !== "mass" && (
        <>
          {Object.values(eventsWithoutCluster)
            .filter((event) => {
              return event.startDate != null || event.endDate != null;
            })
            .map((event: EntityEvent, idx: number) => {
              return (
                <TimelineEvent
                  id={`${event.id}`}
                  key={`${event.id}${JSON.stringify(props)}`}
                  // @ts-ignore
                  ref={(el) => itemsRef.current.push(el)}
                  vertical={vertical}
                  timeScale={timeScale}
                  timeScaleOffset={timeScale(entityExtent[0])}
                  midOffset={midOffset}
                  event={event}
                  entityIndex={index}
                  thickness={thickness}
                  showLabels={showLabels}
                  mode={mode}
                  overlap={overlap}
                  overlapIndex={0}
                  diameter={diameter}
                />
              );
            })}
          {clusteredEvents.map((clusteredEvents, idx) => {
            return (
              <TimelineEventCluster
                id={`${entity.id}${idx}TimelineEventCluster`}
                key={`${entity.id}${idx}TimelineEventCluster${JSON.stringify(
                  props
                )}`}
                events={clusteredEvents}
                vertical={vertical}
                timeScale={timeScale}
                midOffset={midOffset}
                thickness={thickness}
                clusterMode={clusterMode}
                showLabels={showLabels}
                timeScaleOffset={timeScale(entityExtent[0])}
                entityIndex={index}
                diameter={diameter}
                mode={mode}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
