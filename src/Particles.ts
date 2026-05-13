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
    const count = 8 + Math.floor(Math.random() * 5); // 8-12 particles
    const mat = new THREE.MeshLambertMaterial({ color });

    for (let i = 0; i < count; i++) {
      const size = 0.06 + Math.random() * 0.08;
      const geo  = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geo, mat.clone());

      // Spawn at random point within the block
      mesh.position.set(
        wx + 0.5 + (Math.random() - 0.5) * 0.8,
        wy + 0.5 + (Math.random() - 0.5) * 0.8,
        wz + 0.5 + (Math.random() - 0.5) * 0.8,
      );

      const speed = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = (Math.random() * 0.5 + 0.3) * Math.PI; // mostly upward

      this.particles.push({
        mesh,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed + 1.5,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
      });
      this.scene.add(mesh);
    }
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
