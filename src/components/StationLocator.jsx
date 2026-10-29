import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  LocateFixed,
  Search,
  X,
  MapPin,
  List,
  Map as MapIcon,
  Clock,
  Info,
} from "lucide-react";
import {
  stations,
  findStations,
  formatDistance,
  directionsUrl,
} from "../data/stations";
const StationMap = lazy(() => import("./StationMap"));

class MapBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="map-placeholder">
        The map couldn’t load. Use the location list and directions below.
      </div>
    ) : (
      this.props.children
    );
  }
}

export default function StationLocator({ onHelp }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("list");
  const [reset, setReset] = useState(0);
  const [tileError, setTileError] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const request = useRef(0);
  const detail = useRef(null);
  const results = useMemo(
    () => findStations(query, location),
    [query, location],
  );
  const station = results.find((s) => s.id === selected);
  useEffect(() => {
    if (selected && window.matchMedia("(max-width: 700px)").matches) {
      detail.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
      detail.current?.focus({ preventScroll: true });
    }
  }, [selected]);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      request.current++;
    };
  }, []);
  const select = (id) => {
    setSelected(id);
  };
  const locate = () => {
    if (!navigator.geolocation) {
      setMessage(
        "Location isn’t supported here. Search a building or browse the list.",
      );
      return;
    }
    const token = ++request.current;
    setLocating(true);
    setMessage("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (token !== request.current) return;
        const position = [coords.latitude, coords.longitude];
        const nearest = findStations("", position)[0];
        setLocation(position);
        setQuery("");
        setSelected(nearest.id);
        setLocating(false);
        setMessage(
          nearest.distance > 15000
            ? "You appear to be outside the UW area. These are planned Seattle campus locations."
            : `Closest planned building: ${nearest.name}. No active returns are confirmed.`,
        );
      },
      (error) => {
        if (token !== request.current) return;
        setLocating(false);
        setMessage(
          error.code === 1
            ? "Location permission is off. Search or choose a building below."
            : "Your location couldn’t be found. Try again or browse the buildings below.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };
  return (
    <section className="locator-page" aria-labelledby="locator-title">
      <div className="locator-title-row">
        <div>
          <p className="eyebrow">
            <MapPin size={14} /> University of Washington · Seattle
          </p>
          <h1 id="locator-title">
            A little power.
            <br className="mobile-only" /> <em>Closer to you.</em>
          </h1>
          <p>
            Explore our planned locations. Find the building that fits your day.
          </p>
        </div>
        <span className="network-count">
          {String(stations.length).padStart(2, "0")}
          <span>planned locations</span>
        </span>
      </div>
      <div className="pilot-banner">
        <Info size={19} />
        <p>
          <strong>The UW network is coming.</strong> These locations are
          planned. Rentals and returns are not yet confirmed here.
        </p>
      </div>
      <div className="locator-tools">
        <div className="search-field">
          <Search size={19} />
          <label className="sr-only" htmlFor="station-search">
            Search buildings or addresses
          </label>
          <input
            id="station-search"
            placeholder="Search a building or address"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setSelected(null);
              }}
            >
              <X size={17} />
            </button>
          )}
        </div>
        <button
          className="button dark locate"
          disabled={locating}
          onClick={locate}
        >
          <LocateFixed size={17} />
          {locating ? "Locating…" : "Use my location"}
        </button>
        <div className="view-switch" aria-label="Choose a station view">
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={17} /> List
          </button>
          <button aria-pressed={view === "map"} onClick={() => setView("map")}>
            <MapIcon size={17} /> Map
          </button>
        </div>
      </div>
      <div className="locator-meta">
        <p role="status">
          {message ||
            "No signup needed. Location is optional and stays in this page’s memory."}
        </p>
        {location && (
          <button
            className="small-link"
            onClick={() => {
              request.current++;
              setLocation(null);
              setMessage("Your location has been cleared.");
            }}
          >
            Clear my location
          </button>
        )}
      </div>
      {(offline || tileError) && (
        <div className="map-warning" role="status">
          {offline ? "You’re offline." : "Some map tiles couldn’t load."} You
          can still search the location list. Directions need a connection.
        </div>
      )}
      <div className={`explorer view-${view}`}>
        <div className="results-panel">
          <div className="results-heading">
            <span aria-live="polite">
              {results.length} {results.length === 1 ? "location" : "locations"}
              {location ? " · nearest first" : ""}
            </span>
            <button
              className="small-link"
              onClick={() => {
                setQuery("");
                setSelected(null);
                setReset(reset + 1);
              }}
            >
              Show all
            </button>
          </div>
          {results.length === 0 ? (
            <div className="empty-state">
              <Search size={28} />
              <h2>No locations found</h2>
              <p>Try PACCAR, Dempsey, Founders, or Golf.</p>
              <button className="button dark" onClick={() => setQuery("")}>
                Show all locations
              </button>
            </div>
          ) : (
            <ul className="station-list">
              {results.map((s) => (
                <li key={s.id}>
                  <button
                    className={`station-card ${selected === s.id ? "selected" : ""}`}
                    onClick={() => select(s.id)}
                    aria-pressed={selected === s.id}
                    aria-controls="station-details"
                  >
                    <span className="station-icon">
                      <MapPin size={20} />
                    </span>
                    <span className="station-card-copy">
                      <strong>{s.name}</strong>
                      <span>{s.area}</span>
                      <span className="status-line">
                        <span className="status">Planned</span>
                        {s.distance !== null && (
                          <span>{formatDistance(s.distance)} away</span>
                        )}
                      </span>
                    </span>
                    <ArrowRight size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="list-footnote">
            {location
              ? "Distances are straight-line estimates, not walking distances. "
              : ""}
            Pins identify buildings. Exact station placement is pending.
          </p>
        </div>
        <div className="map-panel">
          <MapBoundary>
            <Suspense
              fallback={
                <div className="map-placeholder">Loading the campus map…</div>
              }
            >
              <StationMap
                items={results}
                selected={station?.id}
                onSelect={select}
                location={location}
                reset={reset}
                onTileError={() => setTileError(true)}
              />
            </Suspense>
          </MapBoundary>
          <span className="map-label">UW · Seattle</span>
        </div>
        <section
          className={`station-detail ${station ? "has-selection" : ""}`}
          id="station-details"
          ref={detail}
          tabIndex={-1}
          aria-live="polite"
          aria-label="Selected location details"
        >
          {station ? (
            <>
              <div className="detail-title">
                <div>
                  <span className="status">Planned location</span>
                  <h2>{station.name}</h2>
                  <p>{station.address}</p>
                </div>
                <button
                  className="icon-button"
                  aria-label="Close location details"
                  onClick={() => setSelected(null)}
                >
                  <X size={19} />
                </button>
              </div>
              <div className="detail-facts">
                <div>
                  <MapPin size={18} />
                  <p>
                    <strong>Inside the building</strong>
                    <span>
                      {station.indoor ||
                        "Exact floor and station placement to be confirmed."}
                    </span>
                  </p>
                </div>
                <div>
                  <Clock size={18} />
                  <p>
                    <strong>Access & returns</strong>
                    <span>
                      {station.hours ||
                        "Hours and return availability are not yet confirmed."}
                    </span>
                  </p>
                </div>
              </div>
              <a
                className="button primary"
                href={directionsUrl(station)}
                target="_blank"
                rel="noreferrer"
              >
                Directions to building <ArrowUpRight size={18} />
              </a>
              <p className="detail-note">
                Opens Google Maps. This is not an active return-point
                confirmation.
              </p>
            </>
          ) : (
            <div className="selection-prompt">
              <MapPin size={24} />
              <h2>Choose a location</h2>
              <p>
                Tap a building in the list or on the map for details and walking
                directions.
              </p>
            </div>
          )}
        </section>
      </div>
      <div className="locator-bottom">
        <p>
          <strong>Returning a device right now?</strong> Follow the instructions
          on your station or receipt. This map cannot verify a return.
        </p>
        <button className="text-link" onClick={onHelp}>
          Get help <ArrowUpRight size={17} />
        </button>
      </div>
    </section>
  );
}
