import * as THREE from "three";
import { PATH_WAYPOINTS, ENEMY_Y } from "./config/map";

export const WAYPOINTS: THREE.Vector3[] = PATH_WAYPOINTS.map(
  ([x, z]) => new THREE.Vector3(x + 0.5, ENEMY_Y, z + 0.5)
);

export const SPAWN_POINT = WAYPOINTS[0].clone();
export const BASE_POINT  = WAYPOINTS[WAYPOINTS.length - 1].clone();
const WAYPOINT_REACH_DIST = 0.25;

export interface WaypointResult {
  newPosition: THREE.Vector3;
  newIndex: number;
  reachedBase: boolean;
}

export function advanceTowardWaypoint(
  position: THREE.Vector3,
  waypointIndex: number,
  speed: number,
  dt: number
): WaypointResult {
  if (waypointIndex >= WAYPOINTS.length) {
    return { newPosition: position.clone(), newIndex: waypointIndex, reachedBase: true };
  }

  const target = WAYPOINTS[waypointIndex];
  const delta = target.clone().sub(position);
  const dist = delta.length();

  if (dist < WAYPOINT_REACH_DIST) {
    const nextIndex = waypointIndex + 1;
    return {
      newPosition: target.clone(),
      newIndex: nextIndex,
      reachedBase: nextIndex >= WAYPOINTS.length,
    };
  }

  const step = delta.normalize().multiplyScalar(Math.min(speed * dt, dist));
  return {
    newPosition: position.clone().add(step),
    newIndex: waypointIndex,
    reachedBase: false,
  };
}

// Returns a 0..1 value: how far along the path this enemy is (0=spawn, 1=base)
export function pathProgress(waypointIndex: number, position: THREE.Vector3): number {
  if (waypointIndex >= WAYPOINTS.length) return 1;
  const segmentStart = waypointIndex > 0 ? WAYPOINTS[waypointIndex - 1] : WAYPOINTS[0];
  const segmentEnd   = WAYPOINTS[waypointIndex];
  const segLen = segmentStart.distanceTo(segmentEnd);
  const traveled = segLen > 0 ? segmentStart.distanceTo(position) / segLen : 0;
  const base = waypointIndex / WAYPOINTS.length;
  return base + traveled / WAYPOINTS.length;
}
