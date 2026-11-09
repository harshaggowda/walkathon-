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
  private checkpointBeacons: THREE.Mesh[] = [];
  private sceneryGroup: THREE.Group;
  private lamppostGlows: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'JourneyRoad';
    this.sceneryGroup = new THREE.Group();
    this.group.add(this.sceneryGroup);

    // 1. Establish the continuous sweeping parkway S-curve
    // Flowing gracefully through the park, symmetrically tracked by camera
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
    this.buildRoadVerge();
    this.buildRoad();
    this.buildCurbs();
    this.buildCenterDashes();
    this.buildCheckpoints();
    this.buildParkScenery();
  }

  private buildTerrain(): void {
    // Rich undulating green park meadow with natural rolling contours
    const groundGeo = new THREE.PlaneGeometry(180, 260, 64, 64);
    const posAttr = groundGeo.attributes.position;

    // Apply gentle natural rolling hills outside the road corridor
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Distance from center road corridor
      const distFromCenter = Math.abs(x);
      if (distFromCenter > 5.5) {
        const factor = Math.min((distFromCenter - 5.5) / 12, 1.0);
        const hillElevation =
          (Math.sin(x * 0.08) * 1.8 +
            Math.cos(y * 0.06) * 1.4 +
            Math.sin(x * 0.15 + y * 0.1) * 0.9) *
          factor;
        // In plane geometry before rotation, Z is elevation
        posAttr.setZ(i, Math.max(0, hillElevation));
      } else {
        posAttr.setZ(i, 0);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x5a9148, // Lush spring park meadow green
      roughness: 0.88,
      metalness: 0.02,
      flatShading: false,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.06, -35);
    ground.receiveShadow = true;
    this.sceneryGroup.add(ground);
  }

  private buildRoadVerge(): void {
    // Warm gravel/earth shoulder running alongside both sides of the road
    const segments = 160;
    const roadWidth = 4.8;
    const vergeWidth = 1.6;

    const buildShoulder = (side: 1 | -1) => {
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

        const innerPt = pt.clone().addScaledVector(binormal, side * (roadWidth / 2));
        const outerPt = pt.clone().addScaledVector(binormal, side * (roadWidth / 2 + vergeWidth));

        positions.push(innerPt.x, -0.02, innerPt.z);
        normals.push(0, 1, 0);
        uvs.push(0, t * 25);

        positions.push(outerPt.x, -0.03, outerPt.z);
        normals.push(0, 1, 0);
        uvs.push(1, t * 25);

        if (i < segments) {
          const row1 = i * 2;
          const row2 = (i + 1) * 2;
          indices.push(row1, row1 + 1, row2);
          indices.push(row1 + 1, row2 + 1, row2);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);

      const mat = new THREE.MeshStandardMaterial({
        color: 0x939c87, // Natural crushed granite / earthen park verge
        roughness: 0.95,
        metalness: 0.05,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      this.sceneryGroup.add(mesh);
    };

    buildShoulder(1);
    buildShoulder(-1);
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

    // Warm high-grade civic parkway asphalt
    const material = new THREE.MeshStandardMaterial({
      color: 0x333b37, // Rich slate charcoal asphalt
      roughness: 0.65,
      metalness: 0.12,
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

    const curbGeo = (c: THREE.CatmullRomCurve3) => new THREE.TubeGeometry(c, 120, 0.09, 8, false);

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xdde4db, // Clean dressed white granite curb
      roughness: 0.68,
      metalness: 0.05,
    });

    this.leftCurv = new THREE.Mesh(curbGeo(leftCurve), curbMat);
    this.rightCurv = new THREE.Mesh(curbGeo(rightCurve), curbMat);
    this.leftCurv.castShadow = true;
    this.rightCurv.castShadow = true;

    this.group.add(this.leftCurv);
    this.group.add(this.rightCurv);
  }

  private buildCenterDashes(): void {
    const count = 52;
    const dashGeo = new THREE.BoxGeometry(0.14, 0.02, 0.85);
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3d8, // Highway thermal white-cream paint
      roughness: 0.6,
      metalness: 0.05,
    });

    this.centerDashes = new THREE.InstancedMesh(dashGeo, dashMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();

      dummy.position.set(pt.x, 0.015, pt.z);
      dummy.lookAt(pt.x + tangent.x, 0.015, pt.z + tangent.z);
      dummy.updateMatrix();

      this.centerDashes.setMatrixAt(i, dummy.matrix);
    }

    this.centerDashes.receiveShadow = true;
    this.group.add(this.centerDashes);
  }

  private buildCheckpoints(): void {
    const archTrussMat = new THREE.MeshStandardMaterial({
      color: 0x223528, // Deep athletic green architectural steel
      metalness: 0.45,
      roughness: 0.35,
    });
    const accentTrimMat = new THREE.MeshStandardMaterial({
      color: 0x98cf6e, // Vibrant energetic green trim
      roughness: 0.3,
      metalness: 0.2,
    });

    JOURNEY_CHECKPOINTS.forEach((cp) => {
      const t = cp.progress;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const color = new THREE.Color(cp.themeColor);

      const cpGroup = new THREE.Group();
      cpGroup.position.copy(pt);
      cpGroup.lookAt(pt.x + tangent.x, pt.y, pt.z + tangent.z);

      // 1. Dual Glowing Ground Ripple Beacon
      const outerRingGeo = new THREE.RingGeometry(2.1, 2.38, 36);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.rotation.x = -Math.PI / 2;
      outerRing.position.y = 0.025;
      cpGroup.add(outerRing);
      this.checkpointGlowRings.push(outerRing);

      const innerBeaconGeo = new THREE.CircleGeometry(0.35, 24);
      const innerBeaconMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const innerBeacon = new THREE.Mesh(innerBeaconGeo, innerBeaconMat);
      innerBeacon.rotation.x = -Math.PI / 2;
      innerBeacon.position.y = 0.028;
      cpGroup.add(innerBeacon);
      this.checkpointBeacons.push(innerBeacon);

      // 2. Architectural Marathon Festival Truss Gantry Arch
      const archSpan = 5.4;
      const archHeight = 4.6;

      // Upright dual truss columns
      [-archSpan / 2, archSpan / 2].forEach((xPos) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.32, archHeight, 0.32), archTrussMat);
        col.position.set(xPos, archHeight / 2, 0);
        col.castShadow = true;
        cpGroup.add(col);

        // Base footplate
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.55), accentTrimMat);
        base.position.set(xPos, 0.09, 0);
        cpGroup.add(base);
      });

      // Overhead Lintel Gantry Beam
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(archSpan + 0.6, 0.52, 0.45), archTrussMat);
      lintel.position.set(0, archHeight, 0);
      lintel.castShadow = true;
      cpGroup.add(lintel);

      // Event Branding Banner
      const bannerGeo = new THREE.PlaneGeometry(archSpan - 0.4, 0.72);
      const bannerMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.22,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.set(0, archHeight - 0.25, 0.24);
      cpGroup.add(banner);

      // Checkpoint Milestone Badge Crown
      const badgeGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.12, 24);
      badgeGeo.rotateX(Math.PI / 2);
      const badge = new THREE.Mesh(badgeGeo, bannerMat);
      badge.position.set(0, archHeight + 0.62, 0);
      cpGroup.add(badge);

      this.group.add(cpGroup);
      this.checkpointArches.push(cpGroup);
    });

    // 3. Final Destination Grand Arch at curve destination
    const finishPt = this.curve.getPointAt(0.999);
    const finishTan = this.curve.getTangentAt(0.999).normalize();
    const grandArch = new THREE.Group();
    grandArch.position.copy(finishPt);
    grandArch.lookAt(finishPt.x + finishTan.x, finishPt.y, finishPt.z + finishTan.z);

    const finishTrussMat = new THREE.MeshStandardMaterial({
      color: 0x1d3826,
      metalness: 0.5,
      roughness: 0.3,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0x9be060,
      emissive: 0x6bb83b,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.4,
    });

    // Monumental twin gateway pillars
    [-3.3, 3.3].forEach((x) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.4, 0.65), finishTrussMat);
      p.position.set(x, 3.2, 0);
      p.castShadow = true;
      grandArch.add(p);

      const goldPillarTrim = new THREE.Mesh(new THREE.BoxGeometry(0.14, 6.2, 0.14), goldMat);
      goldPillarTrim.position.set(x > 0 ? x - 0.28 : x + 0.28, 3.2, 0.34);
      grandArch.add(goldPillarTrim);
    });

    const gLintel = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.1, 0.85), finishTrussMat);
    gLintel.position.set(0, 6.6, 0);
    gLintel.castShadow = true;
    grandArch.add(gLintel);

    const gBanner = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.2), goldMat);
    gBanner.position.set(0, 6.2, 0.44);
    grandArch.add(gBanner);

    this.group.add(grandArch);
  }

  private buildParkScenery(): void {
    // Shared materials for realistic natural park assets
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728, // Natural rich tree bark brown
      roughness: 0.94,
      metalness: 0.05,
    });
    const cypressTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2f23,
      roughness: 0.95,
    });

    // Multi-tonal realistic foliage materials
    const foliageMats = [
      new THREE.MeshStandardMaterial({ color: 0x2e6633, roughness: 0.88, flatShading: false }), // Forest green
      new THREE.MeshStandardMaterial({ color: 0x3f7a42, roughness: 0.86, flatShading: false }), // Leaf green
      new THREE.MeshStandardMaterial({ color: 0x4e8a4a, roughness: 0.84, flatShading: false }), // Sunlit canopy green
      new THREE.MeshStandardMaterial({ color: 0x28542c, roughness: 0.9, flatShading: false }),  // Deep shade emerald
    ];

    const cypressFoliageMat = new THREE.MeshStandardMaterial({
      color: 0x1f4726, // Deep Italian cypress green
      roughness: 0.9,
    });

    const shrubMats = [
      new THREE.MeshStandardMaterial({ color: 0x4d8c52, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x629f58, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 0xe6df95, roughness: 0.8 }), // Flowering yellow shrub accent
    ];

    const lampMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e2722, // Cast-iron dark park lamppost
      roughness: 0.4,
      metalness: 0.7,
    });

    const lampGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffefb8, // Warm incandescent lantern glow
    });

    const benchWoodMat = new THREE.MeshStandardMaterial({
      color: 0x6b4528, // Varnished teak park bench wood
      roughness: 0.75,
    });

    // Helper: Build a realistic spreading deciduous tree (Grand Oak)
    const createGrandOak = (scale: number, variant: number): THREE.Group => {
      const tree = new THREE.Group();

      // 1. Organic tapered main trunk
      const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.32 * scale, 3.4 * scale, 10);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.65 * scale;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // Root flare at base
      const rootGeo = new THREE.CylinderGeometry(0.34 * scale, 0.48 * scale, 0.35 * scale, 8);
      const root = new THREE.Mesh(rootGeo, trunkMat);
      root.position.y = 0.17 * scale;
      root.receiveShadow = true;
      tree.add(root);

      // 2. Secondary branching boughs
      const boughGeo = new THREE.CylinderGeometry(0.09 * scale, 0.14 * scale, 1.4 * scale, 7);
      const boughAngles = [-0.65, 0.7, 0.1];
      boughAngles.forEach((ang, bi) => {
        const bough = new THREE.Mesh(boughGeo, trunkMat);
        bough.position.set(Math.sin(ang) * 0.45 * scale, 2.7 * scale, Math.cos(ang) * 0.4 * scale);
        bough.rotation.z = (bi % 2 === 0 ? 0.38 : -0.36) * Math.cos(ang);
        bough.rotation.x = Math.sin(ang) * 0.35;
        bough.castShadow = true;
        tree.add(bough);
      });

      // 3. Realistic organic multi-layered canopy clusters
      const canopy = new THREE.Group();
      const clusters = [
        { x: 0, y: 4.1, z: 0, r: 1.55, matIdx: 2 },
        { x: -0.75, y: 3.65, z: 0.3, r: 1.3, matIdx: 1 },
        { x: 0.8, y: 3.75, z: -0.25, r: 1.35, matIdx: 0 },
        { x: 0.25, y: 3.5, z: 0.85, r: 1.25, matIdx: 3 },
        { x: -0.3, y: 3.4, z: -0.8, r: 1.2, matIdx: 1 },
        { x: 0, y: 4.75, z: 0.1, r: 1.15, matIdx: 2 },
      ];

      clusters.forEach((cl) => {
        const fMat = foliageMats[(cl.matIdx + variant) % foliageMats.length];
        const folMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(cl.r * scale, 1), fMat);
        folMesh.position.set(cl.x * scale, cl.y * scale, cl.z * scale);
        folMesh.scale.set(1.05, 0.88, 1.0);
        folMesh.castShadow = true;
        folMesh.receiveShadow = true;
        canopy.add(folMesh);
      });

      tree.add(canopy);
      return tree;
    };

    // Helper: Build a tall slender Italian Cypress / Columnar Poplar
    const createCypress = (scale: number): THREE.Group => {
      const tree = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.2 * scale, 1.8 * scale, 8);
      const trunk = new THREE.Mesh(trunkGeo, cypressTrunkMat);
      trunk.position.y = 0.9 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      // Layered conical evergreen spire
      const layers = [
        { y: 2.2, rBot: 0.85, rTop: 0.65, h: 1.8 },
        { y: 3.4, rBot: 0.72, rTop: 0.45, h: 1.8 },
        { y: 4.6, rBot: 0.52, rTop: 0.22, h: 1.7 },
        { y: 5.7, rBot: 0.26, rTop: 0.02, h: 1.3 },
      ];

      layers.forEach((l) => {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(l.rBot * scale, l.h * scale, 9),
          cypressFoliageMat
        );
        cone.position.y = l.y * scale;
        cone.castShadow = true;
        cone.receiveShadow = true;
        tree.add(cone);
      });

      return tree;
    };

    // Helper: Build a classic city park lamppost
    const createLamppost = (): THREE.Group => {
      const post = new THREE.Group();

      // Slender fluted pole
      const poleGeo = new THREE.CylinderGeometry(0.045, 0.08, 4.2, 8);
      const pole = new THREE.Mesh(poleGeo, lampMetalMat);
      pole.position.y = 2.1;
      pole.castShadow = true;
      post.add(pole);

      // Ornate bracket head
      const headGeo = new THREE.BoxGeometry(0.28, 0.32, 0.28);
      const head = new THREE.Mesh(headGeo, lampMetalMat);
      head.position.y = 4.3;
      post.add(head);

      // Glowing warm lantern core
      const lanternGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const lantern = new THREE.Mesh(lanternGeo, lampGlowMat);
      lantern.position.y = 4.18;
      post.add(lantern);
      this.lamppostGlows.push(lantern);

      return post;
    };

    // Helper: Build a scenic wooden park bench
    const createParkBench = (): THREE.Group => {
      const bench = new THREE.Group();

      // Cast-iron side legs
      const legGeo = new THREE.BoxGeometry(0.08, 0.52, 0.45);
      [-0.65, 0.65].forEach((x) => {
        const leg = new THREE.Mesh(legGeo, lampMetalMat);
        leg.position.set(x, 0.26, 0);
        leg.castShadow = true;
        bench.add(leg);
      });

      // Wooden seat slats
      const seatGeo = new THREE.BoxGeometry(1.45, 0.04, 0.48);
      const seat = new THREE.Mesh(seatGeo, benchWoodMat);
      seat.position.set(0, 0.5, 0);
      seat.castShadow = true;
      bench.add(seat);

      // Wooden backrest
      const backGeo = new THREE.BoxGeometry(1.45, 0.38, 0.04);
      const back = new THREE.Mesh(backGeo, benchWoodMat);
      back.position.set(0, 0.78, -0.2);
      back.rotation.x = -0.15;
      back.castShadow = true;
      bench.add(back);

      return bench;
    };

    // Distribute scenery along the full 100m parkway route
    const scenerySteps = 32;
    for (let i = 0; i < scenerySteps; i++) {
      const t = (i + 0.35) / scenerySteps;
      const pt = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      // 1. Trees on both sides with natural variety and depth
      // Left side: offset -4.0m to -4.3m (safe from left-side card)
      // Right side: offset +4.5m to +7.8m (spreading into open park)
      const offsets = [
        { side: -1, dist: 4.1 + (i % 3) * 0.35, isCypress: i % 4 === 1 },
        { side: 1, dist: 4.5 + ((i * 7) % 5) * 0.6, isCypress: i % 3 === 2 },
        // Deep background trees on right side
        { side: 1, dist: 8.2 + ((i * 3) % 4) * 0.8, isCypress: i % 2 === 0 },
      ];

      offsets.forEach((cfg, idx) => {
        const treePos = pt.clone().addScaledVector(binormal, cfg.side * cfg.dist);
        const scale = 0.9 + ((i * 11 + idx * 7) % 7) * 0.06;

        let tree: THREE.Group;
        if (cfg.isCypress) {
          tree = createCypress(scale);
        } else {
          tree = createGrandOak(scale, (i + idx) % 4);
        }

        tree.position.set(treePos.x, 0, treePos.z);
        tree.rotation.y = (i * 1.7 + idx) % (Math.PI * 2);
        this.sceneryGroup.add(tree);

        // 2. Natural flowering shrubs and bush tufts clustered near tree bases
        if (i % 2 === 0 && cfg.dist < 6.0) {
          const shrubGeo = new THREE.DodecahedronGeometry(0.45 * scale, 1);
          const shrubMat = shrubMats[(i + idx) % shrubMats.length];
          const shrub = new THREE.Mesh(shrubGeo, shrubMat);
          shrub.position.set(
            treePos.x + (cfg.side > 0 ? -0.7 : 0.7),
            0.35 * scale,
            treePos.z + (idx % 2 === 0 ? 0.6 : -0.5)
          );
          shrub.scale.set(1.2, 0.75, 1.1);
          shrub.castShadow = true;
          this.sceneryGroup.add(shrub);
        }
      });

      // 3. Classic Park Lampposts along the right-hand curb (every 3rd step)
      if (i % 3 === 1) {
        const lampPos = pt.clone().addScaledVector(binormal, 3.25);
        const lamp = createLamppost();
        lamp.position.set(lampPos.x, 0, lampPos.z);
        lamp.lookAt(lampPos.x - binormal.x, 0, lampPos.z - binormal.z);
        this.sceneryGroup.add(lamp);
      }

      // 4. Scenic Park Benches placed in shaded nooks (every 5th step)
      if (i % 5 === 2) {
        const benchPos = pt.clone().addScaledVector(binormal, 4.35);
        const bench = createParkBench();
        bench.position.set(benchPos.x, 0, benchPos.z);
        // Face toward the running road
        bench.lookAt(benchPos.x - binormal.x, 0, benchPos.z - binormal.z);
        this.sceneryGroup.add(bench);
      }
    }
  }

  public update(activeIdx: number, time: number): void {
    // Animate active checkpoint arch and glowing beacon ring
    this.checkpointArches.forEach((arch, idx) => {
      const isActive = idx === activeIdx;
      const targetScale = isActive ? 1.06 : 1.0;
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
        mat.opacity = 0.42;
        ring.scale.set(1, 1, 1);
      }
    });

    this.checkpointBeacons.forEach((bcn, idx) => {
      const isActive = idx === activeIdx;
      const mat = bcn.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive ? 0.95 + Math.sin(time * 6) * 0.05 : 0.5;
    });

    // Subtle gentle warm pulse on lamppost lanterns
    this.lamppostGlows.forEach((lantern, i) => {
      const mat = lantern.material as THREE.MeshBasicMaterial;
      mat.color.setRGB(1.0, 0.93 + Math.sin(time * 1.5 + i) * 0.04, 0.72);
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
