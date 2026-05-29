import * as THREE from "three";

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private readonly particles: Particle[] = [];

  constructor(private readonly scene: THREE.Scene) {}

  spawnBlockBreak(wx: number, wy: number, wz: number, color: number): void {
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const size = 0.06 + Math.random() * 0.08;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshLambertMaterial({ color }),
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

  spawnEnemyDeath(x: number, y: number, z: number, color: number): void {
    const count = 12 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const size = 0.07 + Math.random() * 0.1;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshLambertMaterial({ color }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.5,
        y + (Math.random() - 0.5) * 0.5,
        z + (Math.random() - 0.5) * 0.5,
      );
      const speed = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      this.spawnParticle(mesh, Math.sin(phi) * Math.cos(theta) * speed, Math.cos(phi) * speed + 2, Math.sin(phi) * Math.sin(theta) * speed, 0.5 + Math.random() * 0.4);
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
  }

  clear(): void {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
    this.particles.length = 0;
  }
}
