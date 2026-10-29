import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = (selected) =>
  L.divIcon({
    className: "marker-shell",
    html: `<span aria-hidden="true" class="map-pin${selected ? " active" : ""}">C</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
function View({ items, selected, reset }) {
  const map = useMap();
  useEffect(() => {
    const fit = () => {
      if (!map.getContainer().clientWidth) return;
      map.invalidateSize();
      const station = items.find((s) => s.id === selected);
      if (station?.position)
        map.setView(station.position, 17, { animate: false });
      else if (items.length)
        map.fitBounds(
          items.map((s) => s.position),
          { padding: [45, 65], maxZoom: 16, animate: false },
        );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map, items, selected, reset]);
  return null;
}
export default function StationMap({
  items,
  selected,
  onSelect,
  location,
  reset,
  onTileError,
}) {
  const mapped = useMemo(() => items.filter((s) => s.position), [items]);
  return (
    <MapContainer
      center={[47.659, -122.3035]}
      zoom={15}
      scrollWheelZoom={false}
      className="station-map"
      aria-label="Map of planned UW Charge locations"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        eventHandlers={{ tileerror: onTileError }}
      />
      {mapped.map((s) => (
        <Marker
          key={s.id}
          position={s.position}
          icon={icon(selected === s.id)}
          title={`${s.name} — planned location`}
          alt={`${s.name} — planned location`}
          ref={(marker) =>
            marker
              ?.getElement()
              ?.setAttribute("aria-label", `${s.name} — planned location`)
          }
          eventHandlers={{ click: () => onSelect(s.id) }}
        >
          <Tooltip direction="top" offset={[0, -35]}>
            {s.name} · Planned
          </Tooltip>
        </Marker>
      ))}
      {location && (
        <CircleMarker
          center={location}
          radius={8}
          pathOptions={{
            color: "#fff",
            weight: 3,
            fillColor: "#2563eb",
            fillOpacity: 1,
          }}
        >
          <Tooltip>Your approximate location</Tooltip>
        </CircleMarker>
      )}
      <View items={mapped} selected={selected} reset={reset} />
    </MapContainer>
  );
}
