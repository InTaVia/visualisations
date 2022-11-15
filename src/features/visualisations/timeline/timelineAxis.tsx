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

export const TimelineAxis = (props): JSX.Element => {
  const {
    timeScale,
    width = 100,
    height = 50,
    vertical = false,
    xScale,
  } = props;

  const [element, setElement] = useElementRef();

  const axisRef = useRef<SVGGElement>(null);

  // repaint axis
  useEffect(() => {
    if (axisRef.current) {
      const sel = select(axisRef.current);
      let ax;

      if (vertical) {
        ax = axisLeft<Date>(xScale).tickFormat(timeFormat("%Y"));
      } else {
        ax = axisBottom<Date>(xScale).tickFormat(timeFormat("%Y"));
      }

      sel.call(ax);
      /* sel.attr("transform", `translate(0, ${yScale.range()[1] + 10})`); */

      // vertical grid lines for each axis tick
      const dateTicks = sel.selectAll<SVGGElement, Date>("g.tick").data();
      sel
        .selectAll<SVGPathElement, Date>(".dummy")
        .data(dateTicks)
        .enter()
        .append("path")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2)
        .attr("shape-rendering", "crispEdges")
        .attr("d", (date) => {
          const x = xScale(date);
          /* const [y0, y1] = yScale.range(); */

          if (vertical) {
            return `M -10 ${x}`;
          } else {
            return `M ${x} 20`;
          }
        });

      return () => {
        sel.html("");
      };
    }
  }, [xScale, axisRef]);

  return (
    <div
      className={`bg-green-400 absolute ${
        vertical === true ? "top-0" : "bottom-0"
      } left-0`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg width={`${width}`} height={`${height}`}>
        <g
          id="x-axis__axis"
          transform={`translate(${vertical ? width - 1 : 0} ${
            vertical ? 0 : 0
          })`}
          ref={axisRef}
        ></g>
      </svg>
    </div>
  );
};
