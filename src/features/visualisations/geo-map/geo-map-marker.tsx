import { Marker } from "react-map-gl";
import type { Position } from "geojson";

interface GeoMapMarkerProps {
    coordinates: Position;
    color: string;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    onClick: () => void;
    /** @default 16 */
    size?: number;
  }
  
export function GeoMapMarker(props: GeoMapMarkerProps): JSX.Element {
    const { color, coordinates, onHoverStart, onHoverEnd, onClick, size = 16 } = props;
  
    const [longitude, latitude] = coordinates;
  
    return (
      <Marker anchor="center" latitude={latitude} longitude={longitude}>
        <svg
          className="cursor-pointer"
          height={size}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          onClick={onClick} 
          viewBox="0 0 24 24"
        >
          <circle cx={12} cy={12} r={size / 2} fill={color} />
        </svg>
      </Marker>
    );
  }