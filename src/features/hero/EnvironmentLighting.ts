import * as THREE from 'three';

export class EnvironmentLighting {
  public group: THREE.Group;
  private particlePoints: THREE.Points | null = null;
  private particleGeometry: THREE.BufferGeometry | null = null;
  private characterFollowLight: THREE.PointLight | null = null;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'EnvironmentLightingGroup';

    // 1. Atmospheric Fog (Navy to dawn glow)
    scene.fog = new THREE.FogExp2(0x070b14, 0.022);

    // 2. Ambient Light (Deep athletic navy)
    const ambient = new THREE.AmbientLight(0x0f1b36, 1.6);
    this.group.add(ambient);

    // 3. Main Sunrise Directional Light (From behind the destination arch toward camera)
    // Produces dramatic athletic rim/contre-jour lighting on the character
    const sunLight = new THREE.DirectionalLight(0xff9e43, 3.2);
    sunLight.position.set(0, 10, -60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.bias = -0.001;
    this.group.add(sunLight);

    // 4. Cool Front/Side Fill Light
    const fillLight = new THREE.DirectionalLight(0x82a8d8, 1.4);
    fillLight.position.set(-8, 12, 14);
    this.group.add(fillLight);

    // 5. Follow Rim PointLight for Character Silhouette
    this.characterFollowLight = new THREE.PointLight(0xff7043, 2.4, 18);
    this.characterFollowLight.position.set(0, 2.5, 2);
    this.group.add(this.characterFollowLight);

    // 6. Dawn Energy Motes (Athletic morning atmosphere)
    this.buildEnergyParticles();
  }

  private buildEnergyParticles(): void {
    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colOrange = new THREE.Color(0xff7043);
    const colGold = new THREE.Color(0xf5a623);
    const colIvory = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      // Distribute along the track length (z: 10 to -55, x: -8 to 8, y: 0.2 to 5)
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.2 + Math.random() * 4.8;
      positions[i * 3 + 2] = 10 - Math.random() * 65;

      const pick = Math.random();
      const c = pick < 0.5 ? colOrange : pick < 0.85 ? colGold : colIvory;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particlePoints = new THREE.Points(this.particleGeometry, particleMat);
    this.group.add(this.particlePoints);
  }

  public update(time: number, characterPos?: THREE.Vector3): void {
    if (this.characterFollowLight && characterPos) {
      this.characterFollowLight.position.set(
        characterPos.x + 0.5,
        characterPos.y + 2.2,
        characterPos.z + 1.8
      );
    }

    // Subtle drift of dawn motes
    if (this.particlePoints) {
      const positions = this.particlePoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i]) * 0.003;
      }
      this.particlePoints.geometry.attributes.position.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.particleGeometry?.dispose();
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || (child as THREE.Points).isPoints) {
        const obj = child as THREE.Mesh | THREE.Points;
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
  }
}
