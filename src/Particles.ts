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

  /** 1-2 tiny smoke puffs trailing behind a flying arrow. */
  spawnArrowTrail(x: number, y: number, z: number): void {
    const count = Math.random() < 0.45 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const size = 0.022 + Math.random() * 0.022;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color: 0x887766, transparent: true, opacity: 0.6 }),
      );
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.08,
        y + (Math.random() - 0.5) * 0.08,
        z + (Math.random() - 0.5) * 0.08,
      );
      const spd = 0.08 + Math.random() * 0.12;
      const theta = Math.random() * Math.PI * 2;
      this.spawnParticle(mesh, Math.cos(theta) * spd, 0.05 + Math.random() * 0.15, Math.sin(theta) * spd, 0.14 + Math.random() * 0.1);
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
