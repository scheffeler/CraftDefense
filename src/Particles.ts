import * as THREE from "three";

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

interface Decal {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  peakOpacity?: number;
}

interface ShockwaveRing {
  mesh: THREE.Mesh;
  life: number;       // Starts at -delay; active when >= 0
  maxLife: number;    // Active duration after life reaches 0
  maxRadius: number;
  maxOpacity?: number; // Peak opacity (default 0.55)
}

interface SmokeParticle {
  mesh: THREE.Mesh;
  vx: number; vy: number; vz: number;
  life: number;
  maxLife: number;
  peakOpacity: number;
}

interface DustMote {
  mesh: THREE.Mesh;
  vx: number; vy: number; vz: number;
  life: number;
  maxLife: number;
  phase: number;
  peakOpacity: number;
}

export class ParticleSystem {
  private readonly particles: Particle[] = [];
  private readonly decals: Decal[] = [];
  private readonly _rings: ShockwaveRing[] = [];
  private readonly _smoke: SmokeParticle[] = [];
  private readonly _dustMotes: DustMote[] = [];
  private _dustBiome = "";

  constructor(private readonly scene: THREE.Scene) {}

  spawnBlockBreak(wx: number, wy: number, wz: number, color: number, blockId?: string): void {
    // Block-type-specific particle colors for visual accuracy
    let colors: number[];
    switch (blockId) {
      case "grass":     colors = [0x5d9e3a, 0x4a8a28, 0x8b5c2a, 0x9e6a3a]; break;
      case "dirt": case "farmland": colors = [0x8b5c2a, 0x7a4e20, 0xa06030, 0x6a3e18]; break;
      case "stone":     colors = [0x888888, 0x777777, 0xaaaaaa, 0x666666]; break;
      case "cobblestone": colors = [0x888070, 0x777060, 0x999888, 0x665050]; break;
      case "wood":      colors = [0x8b5c2a, 0x9e6a3a, 0x7a4e20, 0xb0784a]; break;
      case "planks":    colors = [0xc8a060, 0xb89050, 0xd8b070, 0xa08040]; break;
      case "leaves":    colors = [0x3a7a25, 0x5d9e3a, 0x2a6015, 0x4a8a28]; break;
      case "sand":      colors = [0xd4c484, 0xc8b870, 0xe0d090, 0xbaa860]; break;
      case "iron_ore":  colors = [0x888888, 0xcc8844, 0x999999, 0xaa7733]; break;
      case "coal_ore":  colors = [0x444444, 0x222222, 0x888888, 0x333333]; break;
      case "gold_ore":  colors = [0x888888, 0xddaa00, 0x999999, 0xeebb22]; break;
      case "diamond_ore": colors = [0x888888, 0x00cccc, 0x999999, 0x55ffff]; break;
      case "obsidian":  colors = [0x1a0a2a, 0x2a1a3a, 0x331a44, 0x110820]; break;
      case "snow":      colors = [0xeef4ff, 0xdde8ff, 0xffffff, 0xccddff]; break;
      case "gravel":    colors = [0x888880, 0x777770, 0x999990, 0x666660]; break;
      default:          colors = [color];
    }
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 0.05 + Math.random() * 0.08;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshLambertMaterial({ color: c }),
      );
      mesh.position.set(
        wx + 0.5 + (Math.random() - 0.5) * 0.8,
        wy + 0.5 + (Math.random() - 0.5) * 0.8,
        wz + 0.5 + (Math.random() - 0.5) * 0.8,
      );
      const speed = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = (Math.random() * 0.5 + 0.3) * Math.PI;
      this.spawnParticle(mesh, Math.sin(phi) * Math.cos(theta) * speed, Math.cos(phi) * speed + 1.5, Math.sin(phi) * Math.sin(theta) * speed, 0.4 + Math.random() * 0.3);
    }
  }

  spawnEnemyDeath(x: number, y: number, z: number, color: number, enemyType?: string): void {
    const r = () => Math.random();
    const randPos = () => [x + (r() - 0.5) * 0.6, y + (r() - 0.5) * 0.6, z + (r() - 0.5) * 0.6] as const;
    const randVel = (spd: number) => {
      const theta = r() * Math.PI * 2, phi = r() * Math.PI;
      return [Math.sin(phi) * Math.cos(theta) * spd, Math.cos(phi) * spd + 2, Math.sin(phi) * Math.sin(theta) * spd] as const;
    };
    const box = (w: number, h: number, d: number, c: number, basic = false): THREE.Mesh =>
      new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basic
        ? new THREE.MeshBasicMaterial({ color: c })
        : new THREE.MeshLambertMaterial({ color: c }));

    if (enemyType === "skeleton") {
      // Bone shards: elongated white/gray rectangles
      for (let i = 0; i < 10; i++) {
        const c = (i % 3 === 0) ? 0xcccccc : 0xeeeeee;
        const mesh = box(0.03, 0.13 + r() * 0.07, 0.03, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(3.5 + r() * 4); this.spawnParticle(mesh, vx, vy, vz, 0.5 + r() * 0.4);
      }
      // Persistent bone-shard scatter on the ground
      this.spawnBoneDecals(x, y, z);
    } else if (enemyType === "creeper") {
      // Bright green sparks + sulfur flash
      for (let i = 0; i < 14; i++) {
        const c = (i % 3 === 0) ? 0xaaff00 : (i % 3 === 1) ? 0x22ee22 : 0x55cc22;
        const s = 0.03 + r() * 0.04;
        const mesh = box(s, s, s, c, true);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(4 + r() * 5); this.spawnParticle(mesh, vx, vy, vz, 0.3 + r() * 0.25);
      }
    } else if (enemyType === "spider") {
      // Dark ichor drops: flat discs
      for (let i = 0; i < 10; i++) {
        const c = (i % 2 === 0) ? 0x111111 : 0x221111;
        const s = 0.07 + r() * 0.06;
        const mesh = box(s, s * 0.3, s, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(2.5 + r() * 3.5); this.spawnParticle(mesh, vx, vy, vz, 0.45 + r() * 0.35);
      }
    } else if (enemyType === "golem" || enemyType === "troll" || enemyType === "troll_king") {
      // Large rock/stone chunks: slow, heavy
      const rockCols = [0x888888, 0x666666, 0x9a8870, 0x554444];
      for (let i = 0; i < 10; i++) {
        const c = rockCols[Math.floor(r() * rockCols.length)];
        const s = 0.10 + r() * 0.12;
        const mesh = box(s, s * (0.7 + r() * 0.6), s, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(2 + r() * 3); this.spawnParticle(mesh, vx, vy, vz, 0.65 + r() * 0.5);
      }
    } else if (enemyType === "zombie") {
      // Dark green/rotting flesh chunks with faint glow
      const zombieCols = [0x2a5a2a, 0x3a7a3a, 0x1a4a1a, 0xc8b090];
      for (let i = 0; i < 12; i++) {
        const c = zombieCols[Math.floor(r() * zombieCols.length)];
        const s = 0.06 + r() * 0.09;
        const mesh = box(s, s, s, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(3 + r() * 4); this.spawnParticle(mesh, vx, vy, vz, 0.5 + r() * 0.4);
      }
      // Rot blob ground stains — greenish-black decay puddles
      this.spawnGroundStain(x, y, z, 0x0c1c0c, 0.18, 4 + r() * 2, 0.30);
      if (r() > 0.35) this.spawnGroundStain(x, y, z, 0x0a1808, 0.11, 3 + r() * 2, 0.22,
        (r() - 0.5) * 0.7, (r() - 0.5) * 0.7);
    } else if (enemyType === "goblin" || enemyType === "goblin_miner") {
      // Green dust cloud + tiny coin glints
      const goblinCols = [0x33aa44, 0x22883a, 0x44bb55, 0x1a6628];
      for (let i = 0; i < 14; i++) {
        const c = i < 10 ? goblinCols[Math.floor(r() * goblinCols.length)] : (i % 2 === 0 ? 0xddcc00 : 0xffee44);
        const s = 0.04 + r() * 0.06;
        const mesh = box(s, s * (i < 10 ? 1 : 0.3), s, c, i >= 10);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const spd = i < 10 ? 2.5 + r() * 3.5 : 4 + r() * 5;
        const [vx, vy, vz] = randVel(spd); this.spawnParticle(mesh, vx, vy, vz, 0.35 + r() * 0.3);
      }
      // Ash-green ground spot
      this.spawnGroundStain(x, y, z, 0x162614, 0.11, 2.5 + r() * 1.5, 0.20);
    } else if (enemyType === "orc") {
      // Heavy grey-green muscle chunks + dark blood drops
      const orcCols = [0x556644, 0x445533, 0x667755, 0x8b0000];
      for (let i = 0; i < 12; i++) {
        const c = orcCols[Math.floor(r() * orcCols.length)];
        const s = 0.09 + r() * 0.11;
        const mesh = box(s, s * (0.6 + r() * 0.8), s, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(1.8 + r() * 2.5); this.spawnParticle(mesh, vx, vy, vz, 0.7 + r() * 0.5);
      }
      // Dark blood puddle — main large circle + optional satellite
      this.spawnGroundStain(x, y, z, 0x3a0000, 0.23, 6 + r() * 2, 0.36);
      if (r() > 0.45) this.spawnGroundStain(x, y, z, 0x280000, 0.12, 4 + r() * 2, 0.26,
        (r() - 0.5) * 0.9, (r() - 0.5) * 0.9);
    } else if (enemyType === "uruk_captain") {
      // Dark metal plate shards + blood red flash
      const uCols = [0x222222, 0x333322, 0x8b0000, 0xcc2200, 0x111111];
      for (let i = 0; i < 16; i++) {
        const c = uCols[Math.floor(r() * uCols.length)];
        const isPlate = i < 10;
        const s = isPlate ? 0.06 + r() * 0.10 : 0.04 + r() * 0.05;
        const mesh = box(isPlate ? s * 1.8 : s, isPlate ? s * 0.25 : s, isPlate ? s : s, c, !isPlate);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const spd = isPlate ? 3 + r() * 4.5 : 5 + r() * 6;
        const [vx, vy, vz] = randVel(spd); this.spawnParticle(mesh, vx, vy, vz, isPlate ? 0.55 + r() * 0.4 : 0.25 + r() * 0.2);
      }
      // Boss blood splatter — large dark-crimson puddle + 2 satellite drops
      this.spawnGroundStain(x, y, z, 0x3a0005, 0.28, 8 + r() * 3, 0.40);
      for (let i = 0; i < 2; i++) {
        this.spawnGroundStain(x, y, z, 0x250000, 0.12 + r() * 0.06, 5 + r() * 3, 0.28,
          (r() - 0.5) * 1.2, (r() - 0.5) * 1.2);
      }
    } else {
      // Default: same-color cubes with slight hue variation
      const cr = (color >> 16) & 0xff, cg = (color >> 8) & 0xff, cb = color & 0xff;
      const count = 12 + Math.floor(r() * 6);
      for (let i = 0; i < count; i++) {
        const vr = (r() - 0.5) * 28, vg = (r() - 0.5) * 28, vb = (r() - 0.5) * 28;
        const c = (Math.max(0, Math.min(255, cr + vr) | 0) << 16)
                | (Math.max(0, Math.min(255, cg + vg) | 0) << 8)
                |  Math.max(0, Math.min(255, cb + vb) | 0);
        const size = 0.07 + r() * 0.10;
        const mesh = box(size, size, size, c);
        const [px, py, pz] = randPos(); mesh.position.set(px, py, pz);
        const [vx, vy, vz] = randVel(3 + r() * 4); this.spawnParticle(mesh, vx, vy, vz, 0.5 + r() * 0.4);
      }
    }
  }

  spawnXPOrbs(x: number, y: number, z: number, count: number): void {
    // Orbs cycle through two green shades so a cluster looks varied
    const colors = [0x44ff55, 0x22ee44, 0x66ffaa, 0x00ff66];
    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      const mat = new THREE.MeshLambertMaterial({
        color: c,
        emissive: new THREE.Color(c),
        emissiveIntensity: 0.85,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 5, 4), mat);
      mesh.position.set(x + (Math.random() - 0.5) * 0.4, y + 0.5, z + (Math.random() - 0.5) * 0.4);
      const speed = 1.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      this.spawnParticle(mesh, Math.cos(theta) * speed * 0.4, 2 + Math.random() * 2, Math.sin(theta) * speed * 0.4, 0.8 + Math.random() * 0.5);
    }
  }

  spawnFuseSpark(x: number, y: number, z: number): void {
    const colors = [0xffffff, 0xffcc00, 0xff8800];
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, 0.04),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.15,
        y + Math.random() * 0.1,
        z + (Math.random() - 0.5) * 0.15,
      );
      const theta = Math.random() * Math.PI * 2;
      const spd   = 0.5 + Math.random() * 1.0;
      this.spawnParticle(mesh, Math.cos(theta) * spd * 0.3, 1.5 + Math.random() * 1.0, Math.sin(theta) * spd * 0.3, 0.3 + Math.random() * 0.2);
    }
  }

  spawnExplosion(x: number, y: number, z: number): void {
    const colors = [0xff8800, 0xff4400, 0xffcc00, 0xffffff];
    for (let i = 0; i < 22; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = 0.12 + Math.random() * 0.22;
      const mesh  = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y, z);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const spd   = 4 + Math.random() * 5;
      this.spawnParticle(
        mesh,
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.cos(phi) * spd * 0.5 + 2,
        Math.sin(phi) * Math.sin(theta) * spd,
        0.5 + Math.random() * 0.4,
      );
    }
  }

  /** Bright muzzle flash burst at gun barrel tip. */
  spawnMuzzleFlash(x: number, y: number, z: number, dir: THREE.Vector3): void {
    const colors = [0xffffff, 0xffff88, 0xffcc44];
    for (let i = 0; i < 8; i++) {
      const color = colors[i % colors.length];
      const size  = 0.03 + Math.random() * 0.05;
      const mesh  = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y, z);
      const spd = 1.5 + Math.random() * 2.0;
      const sx = dir.x * spd + (Math.random() - 0.5) * 0.6;
      const sy = dir.y * spd + (Math.random() - 0.5) * 0.6;
      const sz = dir.z * spd + (Math.random() - 0.5) * 0.6;
      this.spawnParticle(mesh, sx, sy, sz, 0.06 + Math.random() * 0.06);
    }
  }

  /** Small impact sparks at bullet hit point. */
  spawnBulletImpact(x: number, y: number, z: number): void {
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.05),
        new THREE.MeshBasicMaterial({ color: 0xffcc44 }),
      );
      mesh.position.set(x, y, z);
      const theta = Math.random() * Math.PI * 2;
      const spd   = 2 + Math.random() * 3;
      this.spawnParticle(mesh, Math.cos(theta) * spd, 1 + Math.random() * 2, Math.sin(theta) * spd, 0.25 + Math.random() * 0.2);
    }
  }

  /** Expanding ring of stone/dust particles when a troll stomps. */
  spawnStompShockwave(x: number, y: number, z: number): void {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const size  = 0.07 + Math.random() * 0.09;
      const color = (i % 3 === 0) ? 0x887766 : (i % 3 === 1) ? 0x665544 : 0x999988;
      const mesh  = new THREE.Mesh(
        new THREE.BoxGeometry(size, size * 0.5, size),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y + 0.15, z);
      const spd  = 3.5 + Math.random() * 2.5;
      const rise = 0.8 + Math.random() * 1.5;
      this.spawnParticle(mesh,
        Math.cos(theta) * spd,
        rise,
        Math.sin(theta) * spd,
        0.45 + Math.random() * 0.35,
      );
    }
    for (let i = 0; i < 8; i++) {
      const size = 0.1 + Math.random() * 0.12;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color: 0xaaa090, transparent: true, opacity: 0.7 }),
      );
      mesh.position.set(x + (Math.random() - 0.5) * 0.5, y + 0.2, z + (Math.random() - 0.5) * 0.5);
      const spd = 0.3 + Math.random() * 0.6;
      this.spawnParticle(mesh, (Math.random() - 0.5) * spd, 2 + Math.random() * 2, (Math.random() - 0.5) * spd, 0.6 + Math.random() * 0.4);
    }
  }

  spawnHealEffect(x: number, y: number, z: number): void {
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0xff4488 }),
      );
      mesh.position.set(x + (Math.random() - 0.5) * 0.5, y, z + (Math.random() - 0.5) * 0.5);
      const theta = Math.random() * Math.PI * 2;
      this.spawnParticle(mesh, Math.cos(theta) * 0.8, 2.5 + Math.random() * 1.5, Math.sin(theta) * 0.8, 0.6 + Math.random() * 0.4);
    }
  }

  spawnSplashEffect(x: number, y: number, z: number): void {
    const colors = [0x44aaff, 0x88ccff, 0xaaddff];
    for (let i = 0; i < 18; i++) {
      const color = colors[i % colors.length];
      const mesh  = new THREE.Mesh(
        new THREE.SphereGeometry(0.05 + Math.random() * 0.06, 4, 4),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y, z);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI * 0.5;
      const spd   = 2 + Math.random() * 3;
      this.spawnParticle(mesh, Math.sin(phi) * Math.cos(theta) * spd, Math.cos(phi) * spd + 1, Math.sin(phi) * Math.sin(theta) * spd, 0.4 + Math.random() * 0.3);
    }
  }

  /** 5-8 small impact splats when a melee weapon connects. */
  spawnMeleeHit(x: number, y: number, z: number, color = 0xcc2222): void {
    const altColor = color === 0xcc2222 ? 0xff3333 : color;
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const c = i % 2 === 0 ? color : altColor;
      const size = 0.04 + Math.random() * 0.05;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size * 1.6, size, size),
        new THREE.MeshBasicMaterial({ color: c }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.3,
        y + (Math.random() - 0.5) * 0.3,
        z + (Math.random() - 0.5) * 0.3,
      );
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() * 0.4 + 0.1) * Math.PI;
      const spd = 1.5 + Math.random() * 2.5;
      this.spawnParticle(mesh,
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.abs(Math.cos(phi)) * spd + 0.8,
        Math.sin(phi) * Math.sin(theta) * spd,
        0.2 + Math.random() * 0.2,
      );
    }
  }

  /** 4-6 small white/gray shards when an arrow hits a target. */
  spawnArrowHit(x: number, y: number, z: number): void {
    const colors = [0xddddcc, 0xccccbb, 0xeeeedd];
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.025, 0.12),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(x, y, z);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const spd = 1.8 + Math.random() * 2.0;
      this.spawnParticle(mesh,
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.cos(phi) * spd + 0.5,
        Math.sin(phi) * Math.sin(theta) * spd,
        0.18 + Math.random() * 0.15,
      );
    }
  }

  /** Tiny feather/air puff behind a flying arrow or bolt. Call every frame per active projectile. */
  spawnArrowTrail(x: number, y: number, z: number, isBolt = false): void {
    if (Math.random() > 0.65) return; // denser trail
    const color = isBolt ? 0x88aacc : 0xddcc88;
    const size = 0.025 + Math.random() * 0.025;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size * 0.5, size),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 }),
    );
    mesh.position.set(
      x + (Math.random() - 0.5) * 0.08,
      y + (Math.random() - 0.5) * 0.08,
      z + (Math.random() - 0.5) * 0.08,
    );
    const spd = 0.2 + Math.random() * 0.3;
    this.spawnParticle(mesh, (Math.random() - 0.5) * spd, (Math.random() - 0.5) * spd, (Math.random() - 0.5) * spd, 0.18 + Math.random() * 0.12);
  }

  /** Faint oval decal placed at ground level under an enemy step. Fades over lifetime. */
  spawnFootprint(x: number, y: number, z: number, color = 0x111111, radius = 0.22, lifetime = 0.5): void {
    const geo = new THREE.CircleGeometry(radius, 8);
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.24,
      depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 0.02, z);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);
    this.decals.push({ mesh, life: 0, maxLife: lifetime });
  }

  /** Ground-circle stain decal — used for blood puddles, rot blobs, ash spots after enemy death. */
  private spawnGroundStain(
    x: number, y: number, z: number,
    color: number, radius: number, lifetime: number, peakOpacity: number,
    scatterX = 0, scatterZ = 0,
  ): void {
    const groundY = y - 1.35;
    const geo = new THREE.CircleGeometry(radius * (0.85 + Math.random() * 0.30), 10);
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: peakOpacity, depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + scatterX, groundY, z + scatterZ);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);
    this.decals.push({ mesh, life: 0, maxLife: lifetime, peakOpacity });
  }

  /** Flat bone-shard decals scattered at skeleton death position — linger for several seconds. */
  private spawnBoneDecals(x: number, y: number, z: number): void {
    const groundY = y - 1.4; // approximate ground surface from enemy center
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const len  = 0.10 + Math.random() * 0.14;
      const wide = 0.025 + Math.random() * 0.015;
      const geo  = new THREE.BoxGeometry(wide, 0.008, len);
      const grey = 0.75 + Math.random() * 0.22;
      const mat  = new THREE.MeshBasicMaterial({
        color: new THREE.Color(grey, grey, grey),
        transparent: true, opacity: 0.52, depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.9,
        groundY + 0.01,
        z + (Math.random() - 0.5) * 0.9,
      );
      mesh.rotation.y = Math.random() * Math.PI;
      this.scene.add(mesh);
      this.decals.push({ mesh, life: 0, maxLife: 5 + Math.random() * 3, peakOpacity: 0.52 });
    }
  }

  /** Tiny water ring-splash when a raindrop hits a flat surface. */
  spawnRainSplash(x: number, y: number, z: number): void {
    const count = 4 + Math.floor(Math.random() * 3);
    const colors = [0xb8d8ff, 0x88bbee, 0xaaccff];
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      const size = 0.025 + Math.random() * 0.025;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size * 1.5, size * 0.4, size),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75 }),
      );
      mesh.position.set(x, y, z);
      const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const spd = 0.8 + Math.random() * 1.0;
      this.spawnParticle(mesh, Math.cos(theta) * spd, 0.5 + Math.random() * 0.8, Math.sin(theta) * spd, 0.15 + Math.random() * 0.15);
    }
  }

  /** Tiny expanding puddle ripple ring for rain ground impact. */
  spawnRainRipple(x: number, y: number, z: number): void {
    const geo = new THREE.RingGeometry(0.04, 0.12, 20);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x88aadd,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y + 0.02, z);
    mesh.scale.setScalar(0.01);
    this.scene.add(mesh);
    this._rings.push({
      mesh,
      life: 0,
      maxLife: 0.55 + Math.random() * 0.35,
      maxRadius: 0.4 + Math.random() * 0.35,
      maxOpacity: 0.22,
    });
  }

  /** Small ground-dust ring for a heavy enemy footstep (troll, golem). */
  spawnFootstepRing(x: number, y: number, z: number, veryHeavy = false): void {
    const geo = new THREE.RingGeometry(0.05, 0.20, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: veryHeavy ? 0x998866 : 0x776655,
      transparent: true, opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y + 0.02, z);
    mesh.scale.setScalar(0.01);
    this.scene.add(mesh);
    this._rings.push({
      mesh,
      life: 0,
      maxLife: 0.45 + Math.random() * 0.20,
      maxRadius: veryHeavy ? 2.0 : 1.4,
      maxOpacity: veryHeavy ? 0.42 : 0.32,
    });
  }

  /** Three staggered expanding ground rings + radiating embers for the Uruk Captain war cry. */
  spawnWarCryShockwave(x: number, y: number, z: number): void {
    const rings = [
      { delay: 0.00, color: 0xff3300, maxRadius: 8.5, maxLife: 0.75 },
      { delay: 0.13, color: 0xff6600, maxRadius: 6.5, maxLife: 0.68 },
      { delay: 0.26, color: 0xffaa00, maxRadius: 5.0, maxLife: 0.60 },
    ];
    for (const cfg of rings) {
      const geo = new THREE.RingGeometry(0.15, 1.0, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(0.01);
      this.scene.add(mesh);
      this._rings.push({ mesh, life: -cfg.delay, maxLife: cfg.maxLife, maxRadius: cfg.maxRadius });
    }

    // Radiating ember sparks
    for (let i = 0; i < 18; i++) {
      const theta = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const c = (i % 3 === 0) ? 0xff3300 : (i % 3 === 1) ? 0xff8800 : 0xffcc00;
      const s = 0.04 + Math.random() * 0.07;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(s, s, s),
        new THREE.MeshBasicMaterial({ color: c }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.6,
        y + 0.15 + Math.random() * 0.4,
        z + (Math.random() - 0.5) * 0.6,
      );
      const spd = 4.5 + Math.random() * 4.5;
      this.spawnParticle(mesh, Math.cos(theta) * spd, 0.8 + Math.random() * 2.0, Math.sin(theta) * spd, 0.45 + Math.random() * 0.3);
    }
  }

  spawnLavaEmbers(x: number, y: number, z: number): void {
    const colors = [0xff6600, 0xff4400, 0xffaa00, 0xff8800];
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = 0.04 + Math.random() * 0.06;
      const mesh  = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.8,
        y + 0.5 + Math.random() * 0.2,
        z + (Math.random() - 0.5) * 0.8,
      );
      const spd = 0.4 + Math.random() * 0.8;
      this.spawnParticle(mesh, (Math.random() - 0.5) * 0.3, spd, (Math.random() - 0.5) * 0.3, 0.5 + Math.random() * 0.5);
    }
  }

  spawnCampfireSmoke(x: number, y: number, z: number): void {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const r = 0.09 + Math.random() * 0.07;
      const grey = 0.42 + Math.random() * 0.22;
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(grey, grey, grey),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 5, 4), mat);
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.3,
        y + 1.05 + Math.random() * 0.25,
        z + (Math.random() - 0.5) * 0.3,
      );
      this._smoke.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.55 + Math.random() * 0.4,
        vz: (Math.random() - 0.5) * 0.25,
        life: 0,
        maxLife: 2.8 + Math.random() * 1.4,
        peakOpacity: 0.22 + Math.random() * 0.10,
      });
      this.scene.add(mesh);
    }
  }

  /** Update only smoke wisps — call always (not just during pointer-locked gameplay). */
  updateSmoke(dt: number): void {
    for (let i = this._smoke.length - 1; i >= 0; i--) {
      const s = this._smoke[i];
      s.life += dt;
      const t = s.life / s.maxLife;
      if (t >= 1) {
        this.scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
        this._smoke.splice(i, 1);
        continue;
      }
      s.mesh.position.x += s.vx * dt;
      s.mesh.position.y += s.vy * (1 - t * 0.35) * dt;
      s.mesh.position.z += s.vz * dt;
      s.mesh.scale.setScalar(1 + t * 2.5);
      const opT = t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82;
      (s.mesh.material as THREE.MeshBasicMaterial).opacity = s.peakOpacity * Math.max(0, opT);
    }
  }

  /** Tiny dust puff when player steps on a surface. Matches the block color. */
  spawnFootstepDust(x: number, y: number, z: number, blockId: string): void {
    let colors: number[];
    switch (blockId) {
      case "grass":       colors = [0x7a5c30, 0x5a8a2a, 0x6a7040]; break;
      case "dirt":
      case "farmland":    colors = [0x8b5c2a, 0x7a4e20, 0xa06030]; break;
      case "sand":        colors = [0xd4c484, 0xc8b870, 0xe0d090]; break;
      case "gravel":      colors = [0x888880, 0x777770, 0x999990]; break;
      case "snow":        colors = [0xddeeff, 0xeef4ff, 0xffffff]; break;
      case "planks":      colors = [0xc8a060, 0xb89050, 0xd8b070]; break;
      default:            colors = [0xaaaaaa, 0x999999, 0x888888]; break; // stone/cobblestone/default
    }
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      const w = 0.06 + Math.random() * 0.06;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, w * 0.4, w),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.65, depthWrite: false }),
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.1 + Math.random() * 0.2;
      mesh.position.set(
        x + Math.cos(angle) * radius,
        y + 0.08 + Math.random() * 0.05,
        z + Math.sin(angle) * radius,
      );
      const spd = 0.3 + Math.random() * 0.5;
      this.spawnParticle(mesh,
        Math.cos(angle) * spd * 0.4,
        0.4 + Math.random() * 0.5,
        Math.sin(angle) * spd * 0.4,
        0.22 + Math.random() * 0.12,
      );
    }
  }

  /** Small colored puff spawned on the top face of a newly placed block. */
  spawnBlockPlace(wx: number, wy: number, wz: number, blockId: string): void {
    let colors: number[];
    switch (blockId) {
      case "grass":       colors = [0x5d9e3a, 0x4a8a28, 0x8b5c2a]; break;
      case "dirt": case "farmland": colors = [0x8b5c2a, 0x7a4e20, 0xa06030]; break;
      case "stone":       colors = [0x888888, 0x777777, 0xaaaaaa]; break;
      case "cobblestone": colors = [0x888070, 0x777060, 0x999888]; break;
      case "wood":        colors = [0x8b5c2a, 0x9e6a3a, 0xb0784a]; break;
      case "planks":      colors = [0xc8a060, 0xb89050, 0xd8b070]; break;
      case "sand":        colors = [0xd4c484, 0xc8b870, 0xe0d090]; break;
      case "snow":        colors = [0xeef4ff, 0xdde8ff, 0xffffff]; break;
      case "leaves":      colors = [0x3a7a25, 0x5d9e3a, 0x4a8a28]; break;
      case "glass":       colors = [0x99ccdd, 0xaaddee, 0xbbcccc]; break;
      default:            colors = [0xaaaaaa, 0x999999];
    }
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      const w = 0.07 + Math.random() * 0.07;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, w * 0.5, w),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.7, depthWrite: false }),
      );
      const angle = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.25;
      mesh.position.set(
        wx + 0.5 + Math.cos(angle) * r,
        wy + 1.05,
        wz + 0.5 + Math.sin(angle) * r,
      );
      const spd = 0.5 + Math.random() * 0.7;
      this.spawnParticle(mesh,
        Math.cos(angle) * spd * 0.3,
        0.6 + Math.random() * 0.6,
        Math.sin(angle) * spd * 0.3,
        0.20 + Math.random() * 0.12,
      );
    }
  }

  /** Bright metallic sparks that fly out when a melee weapon connects. */
  spawnMeleeSparks(x: number, y: number, z: number, fireAspect = false): void {
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const isFire = fireAspect && Math.random() < 0.55;
      const c = isFire
        ? (Math.random() < 0.5 ? 0xff6600 : 0xffaa00)
        : (Math.random() < 0.5 ? 0xffffff : 0xffee66);
      const s = 0.022 + Math.random() * 0.022;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(s * 2.5, s * 0.5, s),
        new THREE.MeshBasicMaterial({ color: c }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.25,
        y + (Math.random() - 0.5) * 0.25,
        z + (Math.random() - 0.5) * 0.25,
      );
      const theta = Math.random() * Math.PI * 2;
      const phi   = (Math.random() * 0.6 + 0.2) * Math.PI;
      const spd   = 3.5 + Math.random() * 5.0;
      this.spawnParticle(mesh,
        Math.sin(phi) * Math.cos(theta) * spd,
        Math.abs(Math.cos(phi)) * spd + 0.5,
        Math.sin(phi) * Math.sin(theta) * spd,
        0.10 + Math.random() * 0.08,
      );
    }
  }

  private spawnParticle(mesh: THREE.Mesh, vx: number, vy: number, vz: number, maxLife: number): void {
    this.particles.push({ mesh, vx, vy, vz, life: 0, maxLife });
    this.scene.add(mesh);
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;

      const t = p.life / p.maxLife;
      if (t >= 1) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
        continue;
      }

      p.vy -= 9.8 * dt; // gravity
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;

      // Fade out in last 30% of life
      if (t > 0.7) {
        (p.mesh.material as THREE.MeshLambertMaterial).opacity = (1 - t) / 0.3;
        (p.mesh.material as THREE.MeshLambertMaterial).transparent = true;
      }

      p.mesh.rotation.x += dt * 5;
      p.mesh.rotation.z += dt * 3;
    }

    // Shockwave rings — expand radially, fade out
    for (let i = this._rings.length - 1; i >= 0; i--) {
      const r = this._rings[i];
      r.life += dt;
      if (r.life >= r.maxLife) {
        this.scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
        this._rings.splice(i, 1);
        continue;
      }
      if (r.life < 0) continue; // Waiting for delay
      const t = r.life / r.maxLife;
      r.mesh.scale.setScalar(Math.max(0.01, r.maxRadius * t));
      const peakOp = r.maxOpacity ?? 0.55;
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - t) * peakOp;
    }

    // Ground decals (footprints etc.) — flat, no gravity, linear fade
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i];
      d.life += dt;
      if (d.life >= d.maxLife) {
        this.scene.remove(d.mesh);
        d.mesh.geometry.dispose();
        (d.mesh.material as THREE.Material).dispose();
        this.decals.splice(i, 1);
        continue;
      }
      (d.mesh.material as THREE.MeshBasicMaterial).opacity = (d.peakOpacity ?? 0.22) * (1 - d.life / d.maxLife);
    }
  }

  // ─── Biome ambient dust ──────────────────────────────────────────────────────

  private spawnDustMote(px: number, py: number, pz: number, biome: string): void {
    const angle  = Math.random() * Math.PI * 2;
    const radius = 2.0 + Math.random() * 7.0;
    const x = px + Math.cos(angle) * radius;
    const z = pz + Math.sin(angle) * radius;

    let geo: THREE.BufferGeometry;
    let color: number;
    let vx: number, vy: number, vz: number;
    let maxLife: number;
    let peakOpacity: number;
    let y: number;

    if (biome === "forest") {
      // Pollen: small spheres floating upward in dappled sunlight
      geo          = new THREE.SphereGeometry(0.016 + Math.random() * 0.008, 4, 2);
      color        = Math.random() < 0.55 ? 0xf4f0c0 : 0xffe8a0;
      vx           = (Math.random() - 0.5) * 0.20;
      vy           = 0.06 + Math.random() * 0.10;
      vz           = (Math.random() - 0.5) * 0.20;
      maxLife      = 6.0 + Math.random() * 5.0;
      peakOpacity  = 0.28 + Math.random() * 0.18;
      y            = py - 0.5 + Math.random() * 2.5;
    } else if (biome === "desert") {
      // Sand grains: flat boxes drifting on the wind
      geo          = new THREE.BoxGeometry(
        0.010 + Math.random() * 0.012,
        0.007,
        0.010 + Math.random() * 0.012,
      );
      color        = Math.random() < 0.6 ? 0xd4c484 : 0xc8aa60;
      vx           = 0.16 + Math.random() * 0.24;   // east wind
      vy           = (Math.random() - 0.5) * 0.028;
      vz           = (Math.random() - 0.5) * 0.10;
      maxLife      = 5.0 + Math.random() * 4.0;
      peakOpacity  = 0.24 + Math.random() * 0.16;
      y            = py - 0.8 + Math.random() * 1.6;
    } else {
      // Plains / other: very faint generic dust motes
      geo          = new THREE.SphereGeometry(0.012, 4, 2);
      color        = 0xddddd0;
      vx           = (Math.random() - 0.5) * 0.10;
      vy           = (Math.random() - 0.5) * 0.05;
      vz           = (Math.random() - 0.5) * 0.10;
      maxLife      = 4.0 + Math.random() * 4.0;
      peakOpacity  = 0.12 + Math.random() * 0.08;
      y            = py - 0.5 + Math.random() * 2.0;
    }

    const mat  = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this._dustMotes.push({
      mesh, vx, vy, vz, life: 0, maxLife,
      phase: Math.random() * Math.PI * 2,
      peakOpacity,
    });
  }

  /** Update drifting ambient-dust motes around the player. Call each frame. */
  updateBiomeDust(px: number, py: number, pz: number, biome: string, dt: number): void {
    // On biome change flush old motes so colour/type updates immediately
    if (this._dustBiome !== biome) {
      for (const m of this._dustMotes) {
        this.scene.remove(m.mesh);
        m.mesh.geometry.dispose();
        (m.mesh.material as THREE.Material).dispose();
      }
      this._dustMotes.length = 0;
      this._dustBiome = biome;
    }

    const maxMotes = biome === "forest" ? 28 : biome === "desert" ? 22 : 10;
    const WRAP_RADIUS_SQ = 11.0 * 11.0;

    // Spawn at most 2 motes per frame until pool is full
    const toSpawn = Math.min(2, maxMotes - this._dustMotes.length);
    for (let s = 0; s < toSpawn; s++) this.spawnDustMote(px, py, pz, biome);

    for (let i = this._dustMotes.length - 1; i >= 0; i--) {
      const m = this._dustMotes[i];
      m.life += dt;
      m.phase += dt * 1.1;

      // Gentle sine sway perpendicular to drift direction
      const sway = Math.sin(m.phase) * (biome === "forest" ? 0.018 : 0.012);
      m.mesh.position.x += (m.vx + sway) * dt;
      m.mesh.position.y += m.vy * dt;
      m.mesh.position.z += (m.vz + Math.cos(m.phase) * 0.010) * dt;

      // Opacity: fade in first 10 %, hold, fade out last 15 %
      const t = m.life / m.maxLife;
      const op = t < 0.10 ? t / 0.10
               : t > 0.85 ? (1 - t) / 0.15
               : 1.0;
      (m.mesh.material as THREE.MeshBasicMaterial).opacity = m.peakOpacity * Math.max(0, op);

      // Wrap: if mote drifted too far, dispose and let pool refill spawn a fresh one
      const dx = m.mesh.position.x - px;
      const dy = m.mesh.position.y - py;
      const dz = m.mesh.position.z - pz;
      if (m.life >= m.maxLife || dx * dx + dy * dy + dz * dz > WRAP_RADIUS_SQ) {
        this.scene.remove(m.mesh);
        m.mesh.geometry.dispose();
        (m.mesh.material as THREE.Material).dispose();
        this._dustMotes.splice(i, 1);
      }
    }
  }

  clear(): void {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
    this.particles.length = 0;
    for (const d of this.decals) {
      this.scene.remove(d.mesh);
      d.mesh.geometry.dispose();
      (d.mesh.material as THREE.Material).dispose();
    }
    this.decals.length = 0;
    for (const r of this._rings) {
      this.scene.remove(r.mesh);
      r.mesh.geometry.dispose();
      (r.mesh.material as THREE.Material).dispose();
    }
    this._rings.length = 0;
    for (const s of this._smoke) {
      this.scene.remove(s.mesh);
      s.mesh.geometry.dispose();
      (s.mesh.material as THREE.Material).dispose();
    }
    this._smoke.length = 0;
    for (const m of this._dustMotes) {
      this.scene.remove(m.mesh);
      m.mesh.geometry.dispose();
      (m.mesh.material as THREE.Material).dispose();
    }
    this._dustMotes.length = 0;
    this._dustBiome = "";
  }
}
