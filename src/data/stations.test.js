import test from "node:test";
import assert from "node:assert/strict";
import {
  stations,
  findStations,
  distanceMeters,
  formatDistance,
  directionsUrl,
} from "./stations.js";

test("public locations remain planned without fabricated operational data", () => {
  assert.equal(stations.length, 4);
  for (const station of stations) {
    assert.equal(station.status, "planned");
    assert.equal(station.indoor, null);
    assert.equal(station.hours, null);
    assert.equal(station.position.length, 2);
  }
});
test("manual search supports case, whitespace, multiple words, area, and address", () => {
  assert.equal(findStations("  FOUNDERS hall ")[0].id, "founders");
  assert.equal(findStations("foster").length, 3);
  assert.equal(findStations("2800 clark")[0].id, "golf-range");
  assert.equal(findStations("no-such-building").length, 0);
  assert.equal(findStations("   ").length, 4);
  assert.ok(findStations("").every((s) => s.distance === null));
});
test("location sorts by distance without mutating source data", () => {
  const results = findStations("", stations[3].position);
  assert.equal(results[0].id, "golf-range");
  assert.equal(results[0].distance, 0);
  assert.ok(
    results.every((s, i) => i === 0 || s.distance >= results[i - 1].distance),
  );
  assert.equal(stations[0].id, "paccar");
  assert.equal(stations[0].distance, undefined);
});
test("distance and directions calculations are consistent", () => {
  assert.equal(distanceMeters([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(distanceMeters([0, 0], [0, 1]) - 111195) < 1);
  assert.equal(formatDistance(124), "120 m");
  assert.equal(formatDistance(1240), "1.2 km");
  const url = new URL(directionsUrl(stations[0]));
  assert.equal(
    url.searchParams.get("destination"),
    stations[0].position.join(","),
  );
  assert.equal(url.searchParams.get("travelmode"), "walking");
  assert.equal(url.searchParams.has("origin"), false);
});
