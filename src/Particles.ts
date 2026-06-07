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
}

export class ParticleSystem {
  private readonly particles: Particle[] = [];
  private readonly decals: Decal[] = [];

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
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0x44ff44, emissive: 0x22cc22 } as THREE.MeshBasicMaterialParameters),
      );
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
    if (Math.random() > 0.45) return; // sparse trail
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

  /** Faint oval decal placed at ground level under an enemy step. Fades over 0.5 s. */
  spawnFootprint(x: number, y: number, z: number): void {
    const geo = new THREE.CircleGeometry(0.22, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x111111, transparent: true, opacity: 0.22,
      depthWrite: false, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 0.02, z);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);
    this.decals.push({ mesh, life: 0, maxLife: 0.5 });
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

  /** Tiny orange/red ember that drifts upward from a torch flame. */
  spawnTorchEmber(x: number, y: number, z: number): void {
    const colors = [0xff8c00, 0xff6600, 0xffaa22, 0xff4400, 0xffcc00];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 0.022 + Math.random() * 0.018;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshBasicMaterial({ color }),
    );
    mesh.position.set(
      x + (Math.random() - 0.5) * 0.12,
      y,
      z + (Math.random() - 0.5) * 0.12,
    );
    const upSpeed = 0.55 + Math.random() * 0.65;
    this.spawnParticle(mesh,
      (Math.random() - 0.5) * 0.22,
      upSpeed,
      (Math.random() - 0.5) * 0.22,
      0.45 + Math.random() * 0.55,
    );
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
      (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0.22 * (1 - d.life / d.maxLife);
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
  }
}
