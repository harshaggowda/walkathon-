import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class JourneyRunner {
  public group: THREE.Group;
  private mixer: THREE.AnimationMixer | null = null;
  private action: THREE.AnimationAction | null = null;
  private modelRoot: THREE.Object3D | null = null;
  private isLoaded: boolean = false;
  private lastProgress: number = 0;

  // Secondary motion — organic simulation bones
  private spineBone: THREE.Object3D | null = null;
  private headBone: THREE.Object3D | null = null;
  private armBoneL: THREE.Object3D | null = null;
  private armBoneR: THREE.Object3D | null = null;

  // Breath / idle state
  private stridePhase: number = 0;
  private breathPhase: number = 0;
  private runSpeed: number = 0;        // smoothed animation timescale
  private targetRunSpeed: number = 1;  // driven by scroll velocity

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'JourneyRunner';
    this.stridePhase = 0;
    this.breathPhase = 0;
    this.runSpeed = 1;
    this.targetRunSpeed = 1;
  }

  public async load(onLoaded?: () => void): Promise<void> {
    const loader = new GLTFLoader();

    return new Promise((resolve) => {
      loader.load(
        '/models/walker.glb',
        (gltf) => {
          this.modelRoot = gltf.scene;
          this.modelRoot.scale.set(0.9, 0.9, 0.9);
          this.modelRoot.rotation.y = Math.PI; // Face forward down track
          this.modelRoot.position.set(0, 0, 0);

          // Configure athletic daylight runner materials — richer PBR for realism
          this.modelRoot.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = 0.55;      // softer, more lifelike skin/fabric
                mat.metalness = 0.05;      // near-zero metalness for organic look
                mat.envMapIntensity = 1.4;
                mat.needsUpdate = true;
              }
            }

            // Locate key bones for secondary organic motion
            const name = child.name.toLowerCase();
            if (name.includes('spine') || name.includes('chest') || name.includes('torso')) {
              if (!this.spineBone) this.spineBone = child;
            }
            if (name.includes('head') || name.includes('neck')) {
              if (!this.headBone) this.headBone = child;
            }
            if ((name.includes('upper') || name.includes('upper_arm') || name.includes('arm')) && name.includes('l')) {
              if (!this.armBoneL) this.armBoneL = child;
            }
            if ((name.includes('upper') || name.includes('upper_arm') || name.includes('arm')) && name.includes('r')) {
              if (!this.armBoneR) this.armBoneR = child;
            }
          });

          // Animation setup: Prefer 'Run' for energetic sports campaign feel, or 'Walk'
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.modelRoot);
            const clip =
              gltf.animations.find((c) => c.name.toLowerCase().includes('run')) ||
              gltf.animations.find((c) => c.name.toLowerCase().includes('walk')) ||
              gltf.animations[0];

            this.action = this.mixer.clipAction(clip);
            this.action.setLoop(THREE.LoopRepeat, Infinity);
            this.action.timeScale = 1.0;   // will be driven dynamically in update()
            this.action.play();
          }

          this.group.add(this.modelRoot);
          this.isLoaded = true;
          if (onLoaded) onLoaded();
          resolve();
        },
        undefined,
        (err) => {
          console.error('[JourneyRunner] Runner asset could not be loaded.', err);
          resolve();
        }
      );
    });
  }

  public update(progress: number, delta: number, curve: THREE.CatmullRomCurve3): {
    position: THREE.Vector3;
    tangent: THREE.Vector3;
  } {
    // Clamp normalized progress
    const t = Math.min(Math.max(progress, 0.001), 0.999);

    // Position along the continuous 3D road
    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    this.group.position.copy(position);

    // Align runner facing orientation along route tangent
    const lookTarget = position.clone().add(tangent);
    this.group.lookAt(lookTarget.x, position.y, lookTarget.z);

    // Stride animation advancement:
    // When scrolling, deltaProgress drives stride cadence directly
    const progressDelta = Math.abs(t - this.lastProgress);
    this.lastProgress = t;

    // ── Scroll-velocity-driven timescale ──────────────────────────────────
    // When user scrolls fast → runner strides fast; at rest → idle breath pace
    const scrollVelocity = progressDelta / Math.max(delta, 0.001);
    this.targetRunSpeed = 0.55 + Math.min(scrollVelocity * 18, 1.8);  // 0.55 idle → 2.35 sprint
    this.runSpeed += (this.targetRunSpeed - this.runSpeed) * Math.min(delta * 5, 0.3); // smooth easing

    if (this.mixer) {
      if (this.action) this.action.timeScale = this.runSpeed;
      const strideAdvance = progressDelta * 28 + delta * this.runSpeed * 0.5;
      this.mixer.update(strideAdvance);
    }

    // ── Organic secondary motion ──────────────────────────────────────────
    const time = performance.now() / 1000;
    this.stridePhase += delta * this.runSpeed * 2.6 * Math.PI;   // stride cycle
    this.breathPhase += delta * 0.9 * Math.PI;                   // slow breath

    // 1. Full-body lateral sway — hips shift left-right with each stride
    const lateralSway = Math.sin(this.stridePhase) * 0.025 * this.runSpeed;
    this.group.rotation.z = lateralSway;

    // 2. Subtle forward lean — more lean at higher speed (dynamic forward tilt)
    const forwardLean = 0.04 + (this.runSpeed - 0.55) * 0.045;
    if (this.modelRoot) {
      // Breathing: gentle vertical bob
      const breathBob = Math.sin(this.breathPhase) * 0.008;
      this.modelRoot.position.y = breathBob;

      // Spine torsion — counter-rotate torso to arms naturally
      if (this.spineBone) {
        this.spineBone.rotation.z = -lateralSway * 0.6;                        // counter sway
        this.spineBone.rotation.x = -forwardLean + Math.sin(this.breathPhase) * 0.008;  // forward lean + breath
        this.spineBone.rotation.y = Math.sin(this.stridePhase * 0.5) * 0.06;  // subtle spine twist
      }

      // Head bob — nod gently, look slightly ahead
      if (this.headBone) {
        this.headBone.rotation.x = -0.05 + Math.sin(this.stridePhase * 2) * 0.018;
        this.headBone.rotation.z = Math.sin(this.stridePhase + 0.4) * 0.012;
      }

      // Arm swing — natural pendulum opposite to leg stride
      if (this.armBoneL) {
        this.armBoneL.rotation.x = Math.sin(this.stridePhase + Math.PI) * 0.35 * this.runSpeed;
        this.armBoneL.rotation.z = 0.12;
      }
      if (this.armBoneR) {
        this.armBoneR.rotation.x = Math.sin(this.stridePhase) * 0.35 * this.runSpeed;
        this.armBoneR.rotation.z = -0.12;
      }

      // Unused time var guard
      void time;
    }

    return { position, tangent };
  }

  public get loaded(): boolean {
    return this.isLoaded;
  }

  public dispose(): void {
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
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
