import * as THREE from "three";
import type { VoxelWorld } from "./Map";
import { BLOCK_DEFS } from "./Map";

export interface AABB {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface SweepResult {
  newPos:   THREE.Vector3;
  newVel:   THREE.Vector3;
  onGround: boolean;
  inWater:  boolean;
}

/** Half-extents of the player AABB. */
const HX = 0.3, HY = 0.9, HZ = 0.3;  // 0.6 wide, 1.8 tall, 0.6 deep

/** Returns the player AABB centered horizontally around (x, z) with feet at y. */
export function playerAABB(pos: THREE.Vector3): AABB {
  return {
    min: new THREE.Vector3(pos.x - HX, pos.y,      pos.z - HZ),
    max: new THREE.Vector3(pos.x + HX, pos.y + HY * 2, pos.z + HZ),
  };
}

/** Returns true if the voxel at (wx, wy, wz) is solid (non-air, non-transparent). */
function isSolid(world: VoxelWorld, wx: number, wy: number, wz: number): boolean {
  const id = world.getBlock(wx, wy, wz);
  if (id === "air") return false;
  return !BLOCK_DEFS[id].transparent;
}

function isWater(world: VoxelWorld, wx: number, wy: number, wz: number): boolean {
  return world.getBlock(wx, wy, wz) === "water";
}

/**
 * Checks if the AABB at `pos` (feet position) overlaps any solid voxel.
 * Returns true if there is overlap.
 */
function overlapsWorld(world: VoxelWorld, pos: THREE.Vector3): boolean {
  const aabb = playerAABB(pos);
  const x0 = Math.floor(aabb.min.x), x1 = Math.floor(aabb.max.x - 0.001);
  const y0 = Math.floor(aabb.min.y), y1 = Math.floor(aabb.max.y - 0.001);
  const z0 = Math.floor(aabb.min.z), z1 = Math.floor(aabb.max.z - 0.001);
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        if (isSolid(world, x, y, z)) return true;
      }
    }
  }
  return false;
}

/**
 * Sweep the player AABB through the world for one frame.
 * Resolves each axis independently to allow wall sliding.
 * Supports 1-block automatic step-up on the X and Z axes.
 */
export function sweepAABBWorld(
  world:    VoxelWorld,
  pos:      THREE.Vector3,
  velocity: THREE.Vector3,
  dt:       number,
): SweepResult {
  const newVel = velocity.clone();
  let cur = pos.clone();
  let onGround = false;

  // Water detection at feet and chest height
  const px = Math.floor(pos.x), pz = Math.floor(pos.z);
  const feetInWater = isWater(world, px, Math.floor(pos.y + 0.1), pz);
  const midInWater  = isWater(world, px, Math.floor(pos.y + 0.9), pz);
  const inWater     = feetInWater || midInWater;

  // Gravity (greatly reduced in water)
  newVel.y -= (inWater ? 3.5 : 22) * dt;

  if (inWater) {
    // Water drag on all axes
    const drag = Math.pow(0.7, dt * 15);
    newVel.x *= drag;
    newVel.z *= drag;
    newVel.y *= Math.pow(0.75, dt * 15);
    // Buoyancy when chest is submerged — float toward surface
    if (midInWater) newVel.y += 5 * dt;
  }

  // --- Y axis ---
  const dy = newVel.y * dt;
  const tryY = cur.clone();
  tryY.y += dy;
  if (overlapsWorld(world, tryY)) {
    if (dy < 0) onGround = true;
    newVel.y = 0;
  } else {
    cur = tryY;
  }

  // Check if already standing on ground even with no Y delta
  if (!onGround) {
    const groundCheck = cur.clone();
    groundCheck.y -= 0.05;
    if (overlapsWorld(world, groundCheck)) onGround = true;
  }

  // --- X axis ---
  const dx = newVel.x * dt;
  const tryX = cur.clone();
  tryX.x += dx;
  if (overlapsWorld(world, tryX)) {
    // Try 1-block step-up before giving up
    const stepX = tryX.clone();
    stepX.y += 1.0;
    if (!overlapsWorld(world, stepX)) {
      cur = stepX;
    } else {
      newVel.x = 0;
    }
  } else {
    cur = tryX;
  }

  // --- Z axis ---
  const dz = newVel.z * dt;
  const tryZ = cur.clone();
  tryZ.z += dz;
  if (overlapsWorld(world, tryZ)) {
    // Try 1-block step-up before giving up
    const stepZ = tryZ.clone();
    stepZ.y += 1.0;
    if (!overlapsWorld(world, stepZ)) {
      cur = stepZ;
    } else {
      newVel.z = 0;
    }
  } else {
    cur = tryZ;
  }

  return { newPos: cur, newVel, onGround, inWater };
}
