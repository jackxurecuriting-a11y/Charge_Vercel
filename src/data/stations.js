// Existing building-level coordinates retained from the original UW map.
// Update status and indoor instructions only after the installation is verified.
export const stations = [
  {
    id: "paccar",
    name: "PACCAR Hall",
    area: "Foster School of Business",
    address: "University of Washington, Seattle",
    position: [47.6591372, -122.3086277],
    status: "planned",
    indoor: null,
    hours: null,
  },
  {
    id: "dempsey",
    name: "Dempsey Hall",
    area: "Foster School of Business",
    address: "University of Washington, Seattle",
    position: [47.6591637, -122.3077418],
    status: "planned",
    indoor: null,
    hours: null,
  },
  {
    id: "founders",
    name: "Founders Hall",
    area: "Foster School of Business",
    address: "University of Washington, Seattle",
    position: [47.6588307, -122.3070886],
    status: "planned",
    indoor: null,
    hours: null,
  },
  {
    id: "golf-range",
    name: "UW Golf Driving Range",
    area: "East campus",
    address: "2800 NE Clark Road",
    position: [47.6587984, -122.2972357],
    status: "planned",
    indoor: null,
    hours: null,
  },
];

export function distanceMeters([lat1, lon1], [lat2, lon2]) {
  const radians = (n) => (n * Math.PI) / 180;
  const a =
    Math.sin(radians(lat2 - lat1) / 2) ** 2 +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(radians(lon2 - lon1) / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function findStations(query, location = null) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return stations
    .filter((s) =>
      words.every((word) =>
        `${s.name} ${s.area} ${s.address}`.toLowerCase().includes(word),
      ),
    )
    .map((s) => ({
      ...s,
      distance:
        location && s.position ? distanceMeters(location, s.position) : null,
    }))
    .sort((a, b) =>
      location ? (a.distance ?? Infinity) - (b.distance ?? Infinity) : 0,
    );
}

export function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters / 10) * 10} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

export function directionsUrl(station) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.position.join(","))}&travelmode=walking`;
}
