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

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CharacterControllerGroup';
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

          // Configure materials for athletic campaign aesthetic
          this.modelRoot.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                // Ensure materials respond richly to dramatic lighting
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = 0.4;
                mat.metalness = 0.25;
                mat.envMapIntensity = 1.2;
                mat.needsUpdate = true;
              }
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
            this.walkAction.timeScale = 1.08; // Crisp, brisk athletic stride
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

    // Progression along the route:
    // Continuous natural movement + scroll advancement
    // Total virtual loop track length is 60 meters
    const trackLength = 60;
    this.baseZ += state.delta * CharacterController.STRIDE_SPEED;

    // Scroll drives further progress along the route
    const scrollAdvancement = state.scrollProgress * 25;
    const totalAdvancement = (this.baseZ + scrollAdvancement) % trackLength;

    // Normalized progress along the curve (0 to 1)
    const t = Math.min(Math.max(totalAdvancement / trackLength, 0.001), 0.999);

    // Get position on route curve
    const position = pathCurve.getPointAt(t);
    const tangent = pathCurve.getTangentAt(t).normalize();

    // Align character to path position
    this.group.position.copy(position);

    // Align character facing direction along tangent
    const lookTarget = position.clone().add(tangent);
    this.group.lookAt(lookTarget.x, position.y, lookTarget.z);

    // Subtle natural lateral body sway during stride
    if (this.modelRoot) {
      const strideFreq = 1.08 * Math.PI * 2;
      this.modelRoot.rotation.z = Math.sin(state.time * strideFreq) * 0.035;
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
