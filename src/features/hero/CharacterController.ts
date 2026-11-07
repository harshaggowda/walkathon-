import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { CharacterUpdateState } from './types';

export class CharacterController {
  public group: THREE.Group;
  private mixer: THREE.AnimationMixer | null = null;
  private walkAction: THREE.AnimationAction | null = null;
  private isLoaded: boolean = false;
  private modelRoot: THREE.Object3D | null = null;

  // Stride physics to eliminate foot sliding:
  // Soldier.glb walk cycle completes in ~1.05s covering ~1.45m at 1.0x speed.
  public static readonly STRIDE_SPEED = 1.38; // units per second
  private baseZ: number = 0;

  // Secondary organic motion bones
  private spineBone: THREE.Object3D | null = null;
  private headBone: THREE.Object3D | null = null;
  private armBoneL: THREE.Object3D | null = null;
  private armBoneR: THREE.Object3D | null = null;

  // Organic motion state
  private stridePhase: number = 0;
  private breathPhase: number = 0;
  private smoothedScrollV: number = 0;
  private lastScrollProgress: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CharacterControllerGroup';
    this.stridePhase = 0;
    this.breathPhase = 0;
    this.smoothedScrollV = 0;
    this.lastScrollProgress = 0;
  }

  public async load(onLoadCallback?: () => void): Promise<void> {
    const loader = new GLTFLoader();

    return new Promise((resolve) => {
      loader.load(
        '/models/walker.glb',
        (gltf) => {
          this.modelRoot = gltf.scene;

          // Scale and initial orientation:
          // The character should face toward negative Z (down the track toward destination)
          this.modelRoot.scale.set(1.0, 1.0, 1.0);
          this.modelRoot.rotation.y = Math.PI; // Face forward down track
          this.modelRoot.position.set(0, 0, 0);

          // Configure materials for athletic campaign aesthetic — richer PBR
          this.modelRoot.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                // Organic skin/fabric PBR — softer roughness, low metalness
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = 0.55;
                mat.metalness = 0.05;
                mat.envMapIntensity = 1.4;
                mat.needsUpdate = true;
              }
            }

            // Map secondary motion bones
            const name = child.name.toLowerCase();
            if (name.includes('spine') || name.includes('chest')) {
              if (!this.spineBone) this.spineBone = child;
            }
            if (name.includes('head') || name.includes('neck')) {
              if (!this.headBone) this.headBone = child;
            }
            if ((name.includes('arm') || name.includes('upper')) && name.includes('l')) {
              if (!this.armBoneL) this.armBoneL = child;
            }
            if ((name.includes('arm') || name.includes('upper')) && name.includes('r')) {
              if (!this.armBoneR) this.armBoneR = child;
            }
          });

          // Animation Mixer setup
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.modelRoot);

            // Locate Walk animation clip
            const walkClip =
              gltf.animations.find((clip) =>
                clip.name.toLowerCase().includes('walk')
              ) || gltf.animations[0];

            this.walkAction = this.mixer.clipAction(walkClip);
            this.walkAction.setLoop(THREE.LoopRepeat, Infinity);
            this.walkAction.clampWhenFinished = false;
            this.walkAction.timeScale = 1.0;   // driven dynamically
            this.walkAction.play();
          }

          this.group.add(this.modelRoot);
          this.isLoaded = true;
          if (onLoadCallback) onLoadCallback();
          resolve();
        },
        undefined,
        (error) => {
          console.error('[CharacterController] Runner asset could not be loaded.', error);
          resolve();
        }
      );
    });
  }

  public update(state: CharacterUpdateState, pathCurve: THREE.CatmullRomCurve3): {
    characterPosition: THREE.Vector3;
    tangent: THREE.Vector3;
  } {
    if (this.mixer) {
      this.mixer.update(state.delta);
    }

    // ── Scroll velocity ───────────────────────────────────────────────────
    const scrollVelocity = Math.abs(state.scrollProgress - this.lastScrollProgress) / Math.max(state.delta, 0.001);
    this.lastScrollProgress = state.scrollProgress;
    this.smoothedScrollV += (scrollVelocity - this.smoothedScrollV) * Math.min(state.delta * 6, 0.35);

    // Drive animation timescale — scroll fast → sprint cadence, idle → relaxed walk
    const dynamicTimeScale = 1.0 + Math.min(this.smoothedScrollV * 2.5, 1.2);
    if (this.walkAction) {
      this.walkAction.timeScale = dynamicTimeScale;
    }

    // ── Progression along the route ────────────────────────────────────────
    const trackLength = 60;
    this.baseZ += state.delta * CharacterController.STRIDE_SPEED;
    const scrollAdvancement = state.scrollProgress * 25;
    const totalAdvancement = (this.baseZ + scrollAdvancement) % trackLength;
    const t = Math.min(Math.max(totalAdvancement / trackLength, 0.001), 0.999);

    const position = pathCurve.getPointAt(t);
    const tangent = pathCurve.getTangentAt(t).normalize();

    this.group.position.copy(position);
    const lookTarget = position.clone().add(tangent);
    this.group.lookAt(lookTarget.x, position.y, lookTarget.z);

    // ── Organic secondary motion ─────────────────────────────────────────
    this.stridePhase += state.delta * dynamicTimeScale * 2.6 * Math.PI;
    this.breathPhase += state.delta * 0.85 * Math.PI;

    // Full-body lateral sway with stride
    const lateralSway = Math.sin(this.stridePhase) * 0.025 * dynamicTimeScale;
    this.group.rotation.z = lateralSway;

    if (this.modelRoot) {
      // Breathing vertical bob
      this.modelRoot.position.y = Math.sin(this.breathPhase) * 0.007;

      // Spine — counter-sway, forward lean, subtle twist
      if (this.spineBone) {
        const forwardLean = 0.03 + (dynamicTimeScale - 1) * 0.04;
        this.spineBone.rotation.z = -lateralSway * 0.55;
        this.spineBone.rotation.x = -forwardLean + Math.sin(this.breathPhase) * 0.007;
        this.spineBone.rotation.y = Math.sin(this.stridePhase * 0.5) * 0.055;
      }

      // Head — natural nod and micro-sway
      if (this.headBone) {
        this.headBone.rotation.x = -0.04 + Math.sin(this.stridePhase * 2) * 0.015;
        this.headBone.rotation.z = Math.sin(this.stridePhase + 0.4) * 0.01;
      }

      // Arms — pendulum opposite to stride
      if (this.armBoneL) {
        this.armBoneL.rotation.x = Math.sin(this.stridePhase + Math.PI) * 0.32 * dynamicTimeScale;
        this.armBoneL.rotation.z = 0.1;
      }
      if (this.armBoneR) {
        this.armBoneR.rotation.x = Math.sin(this.stridePhase) * 0.32 * dynamicTimeScale;
        this.armBoneR.rotation.z = -0.1;
      }
    }

    return {
      characterPosition: this.group.position,
      tangent,
    };
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
