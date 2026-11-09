import * as THREE from 'three';
import { JOURNEY_CHECKPOINTS } from '../../config/journey.config';

export class JourneyRoad {
  public group: THREE.Group;
  public curve: THREE.CatmullRomCurve3;
  private roadMesh: THREE.Mesh | null = null;
  private leftCurv: THREE.Mesh | null = null;
  private rightCurv: THREE.Mesh | null = null;
  private centerDashes: THREE.InstancedMesh | null = null;
  private checkpointArches: THREE.Group[] = [];
  private checkpointGlowRings: THREE.Mesh[] = [];
  private sceneryGroup: THREE.Group;
  private bannerFlags: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'JourneyRoad';
    this.sceneryGroup = new THREE.Group();
    this.group.add(this.sceneryGroup);

    // 1. Establish the continuous sweeping parkway S-curve
    // Flowing gracefully through the park, symmetrically framed and tracked by camera
    const curvePoints = [
      new THREE.Vector3(0, 0, 18),
      new THREE.Vector3(0.6, 0, 8),
      new THREE.Vector3(-0.4, 0, -2),     // Checkpoint 01 region (~0.15)
      new THREE.Vector3(0.5, 0, -14),
      new THREE.Vector3(1.0, 0, -26),    // Checkpoint 02 region (~0.42)
      new THREE.Vector3(0.2, 0, -38),
      new THREE.Vector3(-0.6, 0, -50),   // Checkpoint 03 region (~0.70)
      new THREE.Vector3(0.4, 0, -64),
      new THREE.Vector3(0.8, 0, -78),    // Checkpoint 04 region (~0.94)
      new THREE.Vector3(0, 0, -88),      // Finish destination
    ];

    this.curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');

    this.buildTerrain();
    this.buildRoad();
    this.buildCurbs();
    this.buildCenterDashes();
    this.buildCheckpoints();
    this.buildParkScenery();
  }

  private buildTerrain(): void {
    // Fresh green park grass terrain with gentle rolling contours
    const groundGeo = new THREE.PlaneGeometry(160, 240, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x75a95b,
      roughness: 0.85,
      metalness: 0.05,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, -35);
    ground.receiveShadow = true;
    this.sceneryGroup.add(ground);
  }

  private buildRoad(): void {
    const segments = 160;
    const roadWidth = 4.8;
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

      const leftPt = pt.clone().addScaledVector(binormal, -halfWidth);
      positions.push(leftPt.x, leftPt.y, leftPt.z);
      normals.push(0, 1, 0);
      uvs.push(0, t * 30);

      const rightPt = pt.clone().addScaledVector(binormal, halfWidth);
      positions.push(rightPt.x, rightPt.y, rightPt.z);
      normals.push(0, 1, 0);
      uvs.push(1, t * 30);

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

    // Warm civic boulevard asphalt
    const material = new THREE.MeshStandardMaterial({
      color: 0x454d49,
      roughness: 0.7,
      metalness: 0.15,
    });

    this.roadMesh = new THREE.Mesh(geometry, material);
    this.roadMesh.receiveShadow = true;
    this.group.add(this.roadMesh);
  }

  private buildCurbs(): void {
    const segments = 160;
    const halfWidth = 2.4;
    const leftPoints: THREE.Vector3[] = [];
    const rightPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      leftPoints.push(pt.clone().addScaledVector(binormal, -halfWidth).add(new THREE.Vector3(0, 0.05, 0)));
      rightPoints.push(pt.clone().addScaledVector(binormal, halfWidth).add(new THREE.Vector3(0, 0.05, 0)));
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints);

    const curbGeo = (c: THREE.CatmullRomCurve3) => new THREE.TubeGeometry(c, 120, 0.08, 6, false);

    const leftCurbMat = new THREE.MeshStandardMaterial({
      color: 0xced8c8,
      roughness: 0.72,
    });

    const rightCurbMat = new THREE.MeshStandardMaterial({
      color: 0xe0e5d8,
      roughness: 0.72,
    });

    this.leftCurv = new THREE.Mesh(curbGeo(leftCurve), leftCurbMat);
    this.rightCurv = new THREE.Mesh(curbGeo(rightCurve), rightCurbMat);

    this.group.add(this.leftCurv);
    this.group.add(this.rightCurv);
  }

  private buildCenterDashes(): void {
    const count = 50;
    const dashGeo = new THREE.BoxGeometry(0.14, 0.02, 0.8);
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0xe9e8cf,
      roughness: 0.75,
    });

    this.centerDashes = new THREE.InstancedMesh(dashGeo, dashMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();

      dummy.position.set(pt.x, 0.02, pt.z);
      dummy.lookAt(pt.x + tangent.x, 0.02, pt.z + tangent.z);
      dummy.updateMatrix();
      this.centerDashes.setMatrixAt(i, dummy.matrix);
    }

    this.centerDashes.instanceMatrix.needsUpdate = true;
    this.group.add(this.centerDashes);
  }

  private buildCheckpoints(): void {
    JOURNEY_CHECKPOINTS.forEach((cp) => {
      const pt = this.curve.getPointAt(cp.progress);
      const tangent = this.curve.getTangentAt(cp.progress).normalize();

      const cpGroup = new THREE.Group();
      cpGroup.position.copy(pt);
      cpGroup.lookAt(pt.x + tangent.x, pt.y, pt.z + tangent.z);

      const color = new THREE.Color(cp.themeColor);

      // 1. Ground Ring Beacon
      const ringGeo = new THREE.RingGeometry(1.8, 2.3, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.03;
      cpGroup.add(ringMesh);
      this.checkpointGlowRings.push(ringMesh);

      // 2. Checkpoint Arch Structure
      const archSpan = 5.2;
      const archHeight = 4.4;
      const pillarGeo = new THREE.BoxGeometry(0.35, archHeight, 0.4);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x31583d,
        roughness: 0.68,
        metalness: 0.02,
      });

      // Left Pillar
      const leftP = new THREE.Mesh(pillarGeo, pillarMat);
      leftP.position.set(-archSpan / 2, archHeight / 2, 0);
      leftP.castShadow = true;
      cpGroup.add(leftP);

      // Right Pillar
      const rightP = new THREE.Mesh(pillarGeo, pillarMat);
      rightP.position.set(archSpan / 2, archHeight / 2, 0);
      rightP.castShadow = true;
      cpGroup.add(rightP);

      // Overhead Lintel
      const lintelGeo = new THREE.BoxGeometry(archSpan + 0.4, 0.6, 0.5);
      const lintel = new THREE.Mesh(lintelGeo, pillarMat);
      lintel.position.set(0, archHeight + 0.1, 0);
      cpGroup.add(lintel);

      // Glowing Neon Checkpoint Badge Strip
      const neonGeo = new THREE.BoxGeometry(archSpan - 0.2, 0.1, 0.12);
      const neonMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.22,
        roughness: 0.42,
      });
      const neonStrip = new THREE.Mesh(neonGeo, neonMat);
      neonStrip.position.set(0, archHeight - 0.15, 0.26);
      cpGroup.add(neonStrip);

      // Checkpoint Number Disc
      const discGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 24);
      discGeo.rotateX(Math.PI / 2);
      const disc = new THREE.Mesh(discGeo, neonMat);
      disc.position.set(0, archHeight + 0.7, 0);
      cpGroup.add(disc);

      this.group.add(cpGroup);
      this.checkpointArches.push(cpGroup);
    });

    // 3. Final Destination Grand Arch at curve end
    const finishPt = this.curve.getPointAt(0.999);
    const finishTan = this.curve.getTangentAt(0.999).normalize();
    const grandArch = new THREE.Group();
    grandArch.position.copy(finishPt);
    grandArch.lookAt(finishPt.x + finishTan.x, finishPt.y, finishPt.z + finishTan.z);

    const gPillarMat = new THREE.MeshStandardMaterial({
      color: 0x31583d,
      metalness: 0.02,
      roughness: 0.68,
    });
    const gGoldMat = new THREE.MeshStandardMaterial({
      color: 0xb4d77b,
      emissive: 0x75b947,
      emissiveIntensity: 0.28,
      roughness: 0.38,
    });

    // Twin monumental gold pillars
    [-3.2, 3.2].forEach((x) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.2, 0.6), gPillarMat);
      p.position.set(x, 3.1, 0);
      grandArch.add(p);

      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.0, 0.12), gGoldMat);
      strip.position.set(x > 0 ? x - 0.25 : x + 0.25, 3.1, 0.32);
      grandArch.add(strip);
    });

    const gLintel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.0, 0.8), gPillarMat);
    gLintel.position.set(0, 6.5, 0);
    grandArch.add(gLintel);

    this.group.add(grandArch);
  }

  private buildParkScenery(): void {
    const treeTrunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 2.8, 9);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x725b40, roughness: 0.95 });
    const foliageColors = [0x356d43, 0x477d49, 0x5b8c4c, 0x2f6241];

    const treeSteps = 28;
    for (let i = 0; i < treeSteps; i++) {
      const t = (i + 0.3) / treeSteps;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      // Trees on both sides (offset 3.8m on left, 4.6m on right)
      [-3.8, 4.6].forEach((sideOffset, sideIdx) => {
        const treeGroup = new THREE.Group();
        const treePos = pt.clone().addScaledVector(binormal, sideOffset * (0.9 + ((i * 13 + sideIdx * 7) % 10) / 30));
        treeGroup.position.set(treePos.x, 0, treePos.z);

        const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
        trunk.position.y = 1.1;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const folColor = foliageColors[(i + sideIdx) % foliageColors.length];
        const folMat = new THREE.MeshStandardMaterial({ color: folColor, roughness: 0.92 });
        const canopy = new THREE.Group();
        const canopySize = 1.35 + ((i * 5 + sideIdx * 3) % 5) * 0.1;
        for (const [x, y, z, scale] of [[0, 3.25, 0, 1], [-0.62, 3.05, 0.12, 0.76], [0.58, 3.1, -0.1, 0.82]] as const) {
          const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(canopySize * scale, 2), folMat);
          crown.position.set(x, y, z);
          crown.scale.set(1, 0.86, 1);
          crown.castShadow = true;
          canopy.add(crown);
        }
        treeGroup.add(canopy);

        this.sceneryGroup.add(treeGroup);
      });

    }
  }

  public update(activeIdx: number, time: number): void {
    // Animate active checkpoint arch and glowing beacon ring
    this.checkpointArches.forEach((arch, idx) => {
      const isActive = idx === activeIdx;
      const targetScale = isActive ? 1.08 : 1.0;
      arch.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    this.checkpointGlowRings.forEach((ring, idx) => {
      const isActive = idx === activeIdx;
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (isActive) {
        mat.opacity = 0.85 + Math.sin(time * 4) * 0.15;
        const ringScale = 1.0 + Math.sin(time * 3) * 0.08;
        ring.scale.set(ringScale, ringScale, 1);
      } else {
        mat.opacity = 0.45;
        ring.scale.set(1, 1, 1);
      }
    });

    // Subtle gentle fluttering wave on roadside flags
    this.bannerFlags.forEach((flag, i) => {
      flag.rotation.y = Math.sin(time * 2.5 + i) * 0.18;
    });
  }

  public dispose(): void {
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.geometry?.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else if (m.material) {
          m.material.dispose();
        }
      }
    });
  }
}
