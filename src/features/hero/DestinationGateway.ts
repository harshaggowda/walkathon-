import * as THREE from 'three';

export class DestinationGateway {
  public group: THREE.Group;
  private bannerMaterial: THREE.MeshBasicMaterial | null = null;
  private beamLeft: THREE.Mesh | null = null;
  private beamRight: THREE.Mesh | null = null;
  private texturesToDispose: THREE.Texture[] = [];

  constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, -55)) {
    this.group = new THREE.Group();
    this.group.name = 'DestinationGatewayGroup';
    this.group.position.copy(position);

    this.buildArchStructure();
    this.buildMarqueeSign();
    this.buildSkyBeams();
    this.buildDawnSun();
    this.buildFinishLineRoadDecal();
  }

  private buildArchStructure(): void {
    const archGroup = new THREE.Group();

    // Dark architectural titanium material
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x11192b,
      metalness: 0.8,
      roughness: 0.25,
    });

    // Glowing orange energy channel
    const neonOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff5722,
      emissive: 0xff5722,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const neonGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf5a623,
      emissive: 0xf5a623,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });

    // 1. Twin Left/Right Pylons
    const pillarHeight = 6.2;
    const pillarWidth = 0.55;
    const pillarDepth = 0.75;
    const spanWidth = 5.6;

    [-spanWidth / 2, spanWidth / 2].forEach((xPos, idx) => {
      const pCol = new THREE.Mesh(
        new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarDepth),
        archMat
      );
      pCol.position.set(xPos, pillarHeight / 2, 0);
      pCol.castShadow = true;
      archGroup.add(pCol);

      // Embedded vertical neon light channel
      const neonStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, pillarHeight - 0.2, 0.08),
        idx === 0 ? neonOrangeMat : neonGoldMat
      );
      neonStrip.position.set(xPos + (idx === 0 ? 0.25 : -0.25), pillarHeight / 2, 0.38);
      archGroup.add(neonStrip);
    });

    // 2. Overhead Truss Beam
    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(spanWidth + pillarWidth, 0.8, pillarDepth * 1.1),
      archMat
    );
    lintel.position.set(0, pillarHeight + 0.35, 0);
    archGroup.add(lintel);

    // Glowing lower lip of the arch
    const lowerNeon = new THREE.Mesh(
      new THREE.BoxGeometry(spanWidth, 0.08, 0.08),
      neonOrangeMat
    );
    lowerNeon.position.set(0, pillarHeight - 0.04, 0.4);
    archGroup.add(lowerNeon);

    this.group.add(archGroup);
  }

  private buildMarqueeSign(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Background gradient banner
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#0d1527');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0d1527');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);

    // Border
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 1000, 232);

    // Header text
    ctx.font = '900 68px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('WALKATHON 2027', 512, 105);

    // Accent line
    ctx.fillStyle = '#F5A623';
    ctx.fillRect(200, 130, 624, 6);

    // Subtitle
    ctx.font = '700 36px Inter, sans-serif';
    ctx.fillStyle = '#FF7043';
    ctx.fillText('FINISH LINE • EVERY STEP. ONE PURPOSE.', 512, 185);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    this.texturesToDispose.push(texture);

    const bannerGeo = new THREE.PlaneGeometry(5.2, 1.3);
    this.bannerMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const bannerMesh = new THREE.Mesh(bannerGeo, this.bannerMaterial);
    bannerMesh.position.set(0, 5.8, 0.44);
    this.group.add(bannerMesh);
  }

  private buildSkyBeams(): void {
    // Monumental atmospheric searchlight beams shooting skyward
    const beamGeo = new THREE.ConeGeometry(2.4, 28, 16, 1, true);
    beamGeo.translate(0, 14, 0);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffa040,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.beamLeft = new THREE.Mesh(beamGeo, beamMat);
    this.beamLeft.position.set(-2.8, 6.2, 0);

    this.beamRight = new THREE.Mesh(beamGeo, beamMat);
    this.beamRight.position.set(2.8, 6.2, 0);

    this.group.add(this.beamLeft);
    this.group.add(this.beamRight);
  }

  private buildDawnSun(): void {
    // Grand sunrise horizon aura behind the arch
    const sunGeo = new THREE.CircleGeometry(16, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const radGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    radGrad.addColorStop(0, 'rgba(255, 183, 77, 0.95)');
    radGrad.addColorStop(0.35, 'rgba(255, 87, 34, 0.6)');
    radGrad.addColorStop(0.7, 'rgba(245, 166, 35, 0.2)');
    radGrad.addColorStop(1, 'rgba(8, 12, 22, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 512, 512);

    const sunTex = new THREE.CanvasTexture(canvas);
    this.texturesToDispose.push(sunTex);

    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 4.5, -6);
    this.group.add(sunMesh);
  }

  private buildFinishLineRoadDecal(): void {
    // Checkerboard ground finish decal
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Two rows of checkered pattern
    const cols = 16;
    const cellW = 512 / cols;
    const cellH = 64;

    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#FFFFFF' : '#0F172A';
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }

    const decalTex = new THREE.CanvasTexture(canvas);
    this.texturesToDispose.push(decalTex);

    const decalGeo = new THREE.PlaneGeometry(4.8, 1.2);
    const decalMat = new THREE.MeshBasicMaterial({
      map: decalTex,
      transparent: true,
      opacity: 0.9,
    });

    const decalMesh = new THREE.Mesh(decalGeo, decalMat);
    decalMesh.rotation.x = -Math.PI / 2;
    decalMesh.position.set(0, 0.035, 0);
    this.group.add(decalMesh);
  }

  public update(time: number): void {
    // Gentle sway of sky beams
    if (this.beamLeft && this.beamRight) {
      this.beamLeft.rotation.z = Math.sin(time * 0.4) * 0.08 - 0.05;
      this.beamRight.rotation.z = -Math.sin(time * 0.4) * 0.08 + 0.05;
    }
  }

  public dispose(): void {
    this.texturesToDispose.forEach((t) => t.dispose());
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  }
}
