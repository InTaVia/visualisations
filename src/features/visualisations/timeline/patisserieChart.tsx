import type { EntityEvent } from "@/api/intavia.models";
import { TimelineColors as colors } from "@/features/visualisations/timeline/timeline";

import { forwardRef } from "react";

interface PatisserieChartProperties {
  events: Array<EntityEvent>;
  diameter: number;
  patisserieType: "donut" | "pie";
}

const groupBy = (items: Array<any>, key: string) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

export const PatisserieChart = forwardRef(
  (props: PatisserieChartProperties, ref): JSX.Element => {
    const { events, diameter, patisserieType } = props;

    let groupedEvents = groupBy(events, "type");

    const offsets: Array<number> = [];

    const grouped: Array<Array<EntityEvent>> = Object.values(groupedEvents);

    let total = 0;
    for (const groupedValue of grouped) {
      offsets.push(total);
      total += groupedValue.length;
    }
    const r = diameter / 2;
    const r0 = Math.round(r * 0.4);
    const w = r * 2;

    return (
      <svg
        //@ts-ignore
        ref={ref}
        width={`${w}`}
        height={`${w}`}
        viewBox={`0 0 ${w} ${w}`}
        textAnchor="middle"
      >
        <circle cx={r} cy={r} r={r - 1} fill="white" stroke="black"></circle>
        <g transform={"translate(1, 1)"}>
          {grouped.map((item: Array<EntityEvent>, index) => {
            let offset = (
              offsets[index] != null ? offsets[index] : 0
            ) as number;
            return donutSegment(
              offset / total,
              (offset + item.length) / total,
              r - 1,
              r0 - 1,
              // @ts-ignore
              colors[item[0].type],
              patisserieType
            );
          })}
        </g>
      </svg>
    );
  }
);

function donutSegment(
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string,
  patisserieType: "donut" | "pie"
) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  if (patisserieType === "donut") {
    return (
      <path
        d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
          r + r * y0
        } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
          r + r0 * x1
        } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
          r + r0 * y0
        }`}
        fill={`${color}`}
      />
    );
  } else {
    return (
      <path
        d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
          r + r * y0
        } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} Z`}
        fill={`${color}`}
      />
    );
  }
}
