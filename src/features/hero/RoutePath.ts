import * as THREE from 'three';

export class RoutePath {
  public group: THREE.Group;
  public curve: THREE.CatmullRomCurve3;
  private roadMesh: THREE.Mesh | null = null;
  private leftBorder: THREE.Mesh | null = null;
  private rightBorder: THREE.Mesh | null = null;
  private centerDashMesh: THREE.InstancedMesh | null = null;
  private pylonGroup: THREE.Group;
  private milestoneMeshes: THREE.Mesh[] = [];
  private texturesToDispose: THREE.Texture[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RoutePathGroup';
    this.pylonGroup = new THREE.Group();
    this.group.add(this.pylonGroup);

    // 1. Establish the curved boulevard path
    // Gentle athletic S-curve sweeping from foreground to the distant gateway
    const points = [
      new THREE.Vector3(0, 0, 12),
      new THREE.Vector3(0.6, 0, 4),
      new THREE.Vector3(1.0, 0, -6),
      new THREE.Vector3(0.2, 0, -18),
      new THREE.Vector3(-0.8, 0, -30),
      new THREE.Vector3(-0.4, 0, -42),
      new THREE.Vector3(0, 0, -55),
    ];
    this.curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');

    this.buildRoad();
    this.buildBorders();
    this.buildCenterDashes();
    this.buildMilestones();
    this.buildPylons();
  }

  private buildRoad(): void {
    // Generate road surface mesh along the curve
    const segments = 120;
    const roadWidth = 4.4;
    const halfWidth = roadWidth / 2;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      // Left vertex
      const leftPt = pt.clone().addScaledVector(binormal, -halfWidth);
      positions.push(leftPt.x, leftPt.y, leftPt.z);
      normals.push(0, 1, 0);
      uvs.push(0, t * 24);

      // Right vertex
      const rightPt = pt.clone().addScaledVector(binormal, halfWidth);
      positions.push(rightPt.x, rightPt.y, rightPt.z);
      normals.push(0, 1, 0);
      uvs.push(1, t * 24);

      if (i < segments) {
        const row1 = i * 2;
        const row2 = (i + 1) * 2;
        indices.push(row1, row1 + 1, row2);
        indices.push(row1 + 1, row2 + 1, row2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Dark sleek urban marathon asphalt
    const material = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.75,
      metalness: 0.15,
    });

    this.roadMesh = new THREE.Mesh(geometry, material);
    this.roadMesh.receiveShadow = true;
    this.group.add(this.roadMesh);

    // Broad ground contact plane beneath to prevent infinite void
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060912,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  private buildBorders(): void {
    // Glowing track ribbons flanking the road
    const segments = 120;
    const halfWidth = 2.2;

    const leftPoints: THREE.Vector3[] = [];
    const rightPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      leftPoints.push(pt.clone().addScaledVector(binormal, -halfWidth).add(new THREE.Vector3(0, 0.03, 0)));
      rightPoints.push(pt.clone().addScaledVector(binormal, halfWidth).add(new THREE.Vector3(0, 0.03, 0)));
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints);

    const ribbonGeo = (curve: THREE.CatmullRomCurve3) =>
      new THREE.TubeGeometry(curve, 100, 0.055, 6, false);

    // Energetic Orange on left edge
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xff5722,
      emissive: 0xff5722,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });

    // Athletic Cyan/Gold on right edge
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    });

    this.leftBorder = new THREE.Mesh(ribbonGeo(leftCurve), orangeMat);
    this.rightBorder = new THREE.Mesh(ribbonGeo(rightCurve), cyanMat);

    this.group.add(this.leftBorder);
    this.group.add(this.rightBorder);
  }

  private buildCenterDashes(): void {
    const dashCount = 35;
    const dashGeo = new THREE.BoxGeometry(0.12, 0.015, 0.65);
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0xf5a623,
      emissive: 0xf5a623,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });

    this.centerDashMesh = new THREE.InstancedMesh(dashGeo, dashMat, dashCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < dashCount; i++) {
      const t = (i + 0.5) / dashCount;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();

      dummy.position.set(pt.x, 0.02, pt.z);
      dummy.lookAt(pt.x + tangent.x, 0.02, pt.z + tangent.z);
      dummy.updateMatrix();
      this.centerDashMesh.setMatrixAt(i, dummy.matrix);
    }

    this.centerDashMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.centerDashMesh);
  }

  private createDecalTexture(text: string, sub: string, color: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Transparent background
    ctx.clearRect(0, 0, 512, 128);

    // Accent line
    ctx.fillStyle = color;
    ctx.fillRect(40, 20, 8, 88);

    // Main text
    ctx.font = '900 48px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, 64, 68);

    // Subtitle
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(sub, 66, 100);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    this.texturesToDispose.push(texture);
    return texture;
  }

  private buildMilestones(): void {
    const milestones = [
      { t: 0.1, text: 'START LINE', sub: 'JOURNEY BEGINS • STAGE 1', color: '#FF7043' },
      { t: 0.32, text: '1.0 KM', sub: 'HARMONY STRIDE • 3K/5K/10K', color: '#F5A623' },
      { t: 0.55, text: '3.0 KM', sub: 'MOMENTUM ZONE • UNITY', color: '#00E5FF' },
      { t: 0.78, text: '5.0 KM', sub: 'ENDURANCE RIDGE • CIVIC SPIRIT', color: '#FF5722' },
      { t: 0.94, text: 'FINISH ARCH', sub: '10,000 STRIDES AS ONE', color: '#F5A623' },
    ];

    const planeGeo = new THREE.PlaneGeometry(2.4, 0.6);

    milestones.forEach((m) => {
      const tex = this.createDecalTexture(m.text, m.sub, m.color);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      const pt = this.curve.getPointAt(m.t);
      const tangent = this.curve.getTangentAt(m.t).normalize();

      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(pt.x, 0.025, pt.z);
      // Align rotation to road angle
      mesh.rotation.z = Math.atan2(tangent.x, tangent.z);

      this.group.add(mesh);
      this.milestoneMeshes.push(mesh);
    });
  }

  private buildPylons(): void {
    // Architectural light pylons along both road verges
    const count = 16;
    const pylonGeo = new THREE.CylinderGeometry(0.04, 0.06, 2.2, 8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x141e33,
      metalness: 0.7,
      roughness: 0.3,
    });

    const lightGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xffa040,
      emissive: 0xff7043,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      [-2.6, 2.6].forEach((offset) => {
        const pylon = new THREE.Mesh(pylonGeo, pylonMat);
        const pylonPos = pt.clone().addScaledVector(binormal, offset);
        pylon.position.set(pylonPos.x, 1.1, pylonPos.z);
        this.pylonGroup.add(pylon);

        const beacon = new THREE.Mesh(lightGeo, lightMat);
        beacon.position.set(pylonPos.x, 2.22, pylonPos.z);
        this.pylonGroup.add(beacon);
      });
    }
  }

  public update(time: number): void {
    // Subtle rhythmic pulse on border ribbons to convey continuous athletic energy
    if (this.leftBorder && this.leftBorder.material) {
      const mat = this.leftBorder.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.3 + Math.sin(time * 2.2) * 0.35;
    }
    if (this.rightBorder && this.rightBorder.material) {
      const mat = this.rightBorder.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + Math.cos(time * 2.0) * 0.3;
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
