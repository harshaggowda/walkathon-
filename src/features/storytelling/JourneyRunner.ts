import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class JourneyRunner {
  public group: THREE.Group;
  private mixer: THREE.AnimationMixer | null = null;
  private action: THREE.AnimationAction | null = null;
  private modelRoot: THREE.Object3D | null = null;
  private isLoaded: boolean = false;
  private lastProgress: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'JourneyRunner';
  }

  public async load(onLoaded?: () => void): Promise<void> {
    const loader = new GLTFLoader();

    return new Promise((resolve) => {
      loader.load(
        '/models/walker.glb',
        (gltf) => {
          this.modelRoot = gltf.scene;
          this.modelRoot.scale.set(1.22, 1.22, 1.22); // More prominent athletic runner presence
          this.modelRoot.rotation.y = 0; // Face forward along road direction
          this.modelRoot.position.set(0, 0, 0);

          // Configure athletic daylight runner materials
          this.modelRoot.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = 0.35;
                mat.metalness = 0.2;
                mat.needsUpdate = true;
              }
            }
          });

          // Animation setup: Prefer 'Run' for energetic sports campaign feel, or 'Walk'
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.modelRoot);
            const clip =
              gltf.animations.find((c) => c.name.toLowerCase().includes('run')) ||
              gltf.animations.find((c) => c.name.toLowerCase().includes('walk')) ||
              gltf.animations.find((c) => c.name.toLowerCase().includes('mixamo')) ||
              gltf.animations[0];

            this.action = this.mixer.clipAction(clip);
            this.action.setLoop(THREE.LoopRepeat, Infinity);
            this.action.play();
          }

          this.group.add(this.modelRoot);
          this.isLoaded = true;
          if (onLoaded) onLoaded();
          resolve();
        },
        undefined,
        (err) => {
          console.warn('[JourneyRunner] Fallback to procedural runner', err);
          this.buildProceduralRunner();
          this.isLoaded = true;
          if (onLoaded) onLoaded();
          resolve();
        }
      );
    });
  }

  private buildProceduralRunner(): void {
    const fallback = new THREE.Group();
    // Athletic Runner Silhouette
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xff5722, roughness: 0.2 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.75, 12), bodyMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    fallback.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), accentMat);
    head.position.y = 1.62;
    head.castShadow = true;
    fallback.add(head);

    this.group.add(fallback);
    this.modelRoot = fallback;
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

    if (this.mixer) {
      // Direct scroll stride displacement + slight ambient pacing
      const strideAdvance = progressDelta * 32 + delta * 0.45;
      this.mixer.update(strideAdvance);
    }

    // Subtle lateral sway during stride
    if (this.modelRoot) {
      this.modelRoot.rotation.z = Math.sin(t * 120) * 0.04;
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
