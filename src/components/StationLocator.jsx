import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { ArrowUpRight, LocateFixed, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const stations = [
  {
    id: "paccar",
    name: "PACCAR Hall",
    detail: "Foster School of Business",
    position: [47.6591372, -122.3086277],
  },
  {
    id: "dempsey",
    name: "Dempsey Hall",
    detail: "Foster School of Business",
    position: [47.6591637, -122.3077418],
  },
  {
    id: "founders",
    name: "Founders Hall",
    detail: "Foster School of Business",
    position: [47.6588307, -122.3070886],
  },
  {
    id: "golf-range",
    name: "UW Golf Driving Range",
    detail: "2800 NE Clark Road",
    position: [47.6587984, -122.2972357],
  },
];

const stationIcon = L.divIcon({
  className: "charge-marker-shell",
  html: '<span class="charge-marker" aria-hidden="true">C</span>',
  iconAnchor: [22, 44],
  iconSize: [44, 44],
  popupAnchor: [0, -42],
});

const userIcon = L.divIcon({
  className: "user-marker-shell",
  html: '<span class="user-marker" aria-hidden="true"></span>',
  iconAnchor: [10, 10],
  iconSize: [20, 20],
});

function milesBetween([lat1, lon1], [lat2, lon2]) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapViewUpdater({ position, zoom = 17 }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, zoom, { duration: 0.8 });
  }, [map, position, zoom]);

  return null;
}

export default function StationLocator() {
  const [selectedId, setSelectedId] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const selectedStation = stations.find(({ id }) => id === selectedId);

  const stationDistances = useMemo(() => {
    if (!userPosition) return {};
    return Object.fromEntries(
      stations.map((station) => [
        station.id,
        milesBetween(userPosition, station.position),
      ]),
    );
  }, [userPosition]);

  const findNearestStation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location services are not available on this device.");
      return;
    }

    setLocationMessage("Finding your nearest station…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition = [coords.latitude, coords.longitude];
        const nearest = stations.reduce((closest, station) =>
          milesBetween(nextPosition, station.position) <
          milesBetween(nextPosition, closest.position)
            ? station
            : closest,
        );
        setUserPosition(nextPosition);
        setSelectedId(nearest.id);
        setLocationMessage(`${nearest.name} is the closest planned station.`);
      },
      () => {
        setLocationMessage(
          "We could not access your location. Choose a station from the list instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <section className="station-locator" id="stations">
      <div className="locator-heading">
        <div>
          <p className="kicker">UW launch network · 4 planned stations</p>
          <h2>
            Find your nearest
            <br />
            <em>return point.</em>
          </h2>
        </div>
        <div className="locator-intro">
          <p>
            Return your charger at any Charge station. Select a location to
            see it on the map or use your current location to find the closest
            one.
          </p>
          <button className="locate-button" type="button" onClick={findNearestStation}>
            <LocateFixed size={18} /> Use my location
          </button>
          <p className="location-message" aria-live="polite">
            {locationMessage}
          </p>
        </div>
      </div>

      <div className="locator-layout">
        <div className="station-list" aria-label="Charge station locations">
          {stations.map((station, index) => {
            const distance = stationDistances[station.id];
            const isSelected = station.id === selectedId;
            return (
              <button
                className={`station-card${isSelected ? " selected" : ""}`}
                key={station.id}
                onClick={() => setSelectedId(station.id)}
                type="button"
              >
                <span className="station-number">0{index + 1}</span>
                <span className="station-card-copy">
                  <strong>{station.name}</strong>
                  <small>{station.detail}</small>
                </span>
                <span className="station-meta">
                  <span>Planned</span>
                  {distance !== undefined && <small>{distance.toFixed(2)} mi</small>}
                </span>
              </button>
            );
          })}

          <div className="supplier-qr-card">
            <img src="/charge-uw-stations-qr.svg" alt="QR code for the Charge UW station map" />
            <div>
              <strong>Save the station map</strong>
              <p>Scan once. Return here whenever you need a Charge station.</p>
              <a href="/charge-uw-stations-qr.png" download>
                Download print QR <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="map-frame">
          <MapContainer
            center={[47.659, -122.3035]}
            zoom={15}
            scrollWheelZoom
            aria-label="Interactive map of Charge stations at the University of Washington"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((station) => (
              <Marker
                eventHandlers={{ click: () => setSelectedId(station.id) }}
                icon={stationIcon}
                key={station.id}
                position={station.position}
              >
                <Popup>
                  <strong>{station.name}</strong>
                  <span>{station.detail}</span>
                  <span>Planned Charge station</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.position.join(",")}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Get directions <ArrowUpRight size={13} />
                  </a>
                </Popup>
              </Marker>
            ))}
            {userPosition && <Marker icon={userIcon} position={userPosition} />}
            {selectedStation && <MapViewUpdater position={selectedStation.position} />}
          </MapContainer>
          <div className="map-key">
            <MapPin size={14} /> University of Washington · Seattle
          </div>
        </div>
      </div>
    </section>
  );
}
