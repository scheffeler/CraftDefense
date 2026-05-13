import type { VoxelWorld } from "./Map";
import { WORLD_WIDTH, WORLD_DEPTH } from "./config/map";

const W = WORLD_WIDTH;
const D = WORLD_DEPTH;

// Neighbor offsets: 4 cardinal + 4 diagonal
const NEIGHBOR_DX = [-1, 1, 0, 0, -1, -1, 1, 1];
const NEIGHBOR_DZ = [ 0, 0,-1, 1, -1,  1,-1, 1];
const NEIGHBOR_COST = [1, 1, 1, 1, 1.414, 1.414, 1.414, 1.414];

export class FlowField {
  private readonly dist = new Float32Array(W * D).fill(Infinity);
  private readonly dirX = new Float32Array(W * D);
  private readonly dirZ = new Float32Array(W * D);

  constructor(private readonly world: VoxelWorld) {}

  recompute(targetX: number, targetZ: number): void {
    this.dist.fill(Infinity);

    const tx = Math.max(0, Math.min(W - 1, Math.floor(targetX)));
    const tz = Math.max(0, Math.min(D - 1, Math.floor(targetZ)));

    const queue: number[] = [];
    this.dist[tz * W + tx] = 0;
    queue.push(tz * W + tx);

    let head = 0;
    while (head < queue.length) {
      const idx = queue[head++];
      const x = idx % W;
      const z = (idx / W) | 0;
      const d = this.dist[idx];

      for (let n = 0; n < 8; n++) {
        const nx = x + NEIGHBOR_DX[n];
        const nz = z + NEIGHBOR_DZ[n];
        if (nx < 0 || nx >= W || nz < 0 || nz >= D) continue;
        if (!this.isPassable(nx, nz)) continue;
        const nd = d + NEIGHBOR_COST[n];
        const nIdx = nz * W + nx;
        if (nd < this.dist[nIdx]) {
          this.dist[nIdx] = nd;
          queue.push(nIdx);
        }
      }
    }

    this.computeDirections();
  }

  getFlowDirection(wx: number, wz: number): { dx: number; dz: number } {
    const x = Math.max(0, Math.min(W - 1, Math.floor(wx)));
    const z = Math.max(0, Math.min(D - 1, Math.floor(wz)));
    const idx = z * W + x;
    return { dx: this.dirX[idx], dz: this.dirZ[idx] };
  }

  getDistance(wx: number, wz: number): number {
    const x = Math.max(0, Math.min(W - 1, Math.floor(wx)));
    const z = Math.max(0, Math.min(D - 1, Math.floor(wz)));
    return this.dist[z * W + x];
  }

  private isPassable(x: number, z: number): boolean {
    return this.world.getBlock(x, 1, z) === "air";
  }

  private computeDirections(): void {
    for (let z = 0; z < D; z++) {
      for (let x = 0; x < W; x++) {
        let bestDx = 0, bestDz = 0, bestD = Infinity;
        for (let n = 0; n < 8; n++) {
          const nx = x + NEIGHBOR_DX[n];
          const nz = z + NEIGHBOR_DZ[n];
          if (nx < 0 || nx >= W || nz < 0 || nz >= D) continue;
          const nd = this.dist[nz * W + nx];
          if (nd < bestD) {
            bestD = nd;
            bestDx = NEIGHBOR_DX[n];
            bestDz = NEIGHBOR_DZ[n];
          }
        }
        const len = Math.sqrt(bestDx * bestDx + bestDz * bestDz);
        const idx = z * W + x;
        this.dirX[idx] = len > 0 ? bestDx / len : 0;
        this.dirZ[idx] = len > 0 ? bestDz / len : 0;
      }
    }
  }
}
