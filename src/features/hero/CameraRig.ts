import * as THREE from 'three';

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  private currentLookAt: THREE.Vector3;
  private targetLookAt: THREE.Vector3;
  private targetPos: THREE.Vector3;
  private mouseOffset: THREE.Vector2;
  private targetMouseOffset: THREE.Vector2;
  private isMobile: boolean = false;

  // Cinematic breathing
  private breathPhase: number = 0;

  constructor(width: number, height: number) {
    this.isMobile = width < 768;
    const fov = this.isMobile ? 52 : 44;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

    // Initial cinematic over-the-shoulder perspective
    this.camera.position.set(1.4, 2.2, 5.2);
    this.currentLookAt = new THREE.Vector3(0, 1.5, -12);
    this.targetLookAt = new THREE.Vector3(0, 1.5, -12);
    this.targetPos = this.camera.position.clone();

    this.mouseOffset = new THREE.Vector2(0, 0);
    this.targetMouseOffset = new THREE.Vector2(0, 0);
    this.breathPhase = 0;
  }

  public setPointer(normX: number, normY: number): void {
    // Subtle mouse parallax boundaries
    this.targetMouseOffset.set(normX * 0.45, -normY * 0.25);
  }

  public setDimensions(width: number, height: number): void {
    this.isMobile = width < 768;
    this.camera.fov = this.isMobile ? 52 : 44;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public update(characterPos: THREE.Vector3, scrollProgress: number, delta: number): void {
    // Smoothly interpolate mouse parallax
    this.mouseOffset.lerp(this.targetMouseOffset, Math.min(delta * 4, 0.15));

    // Cinematic breath — slow sinusoidal camera movement for life and presence
    this.breathPhase += delta * 0.3;
    const breathX = Math.sin(this.breathPhase * 1.15) * 0.028;
    const breathY = Math.sin(this.breathPhase) * 0.018;

    // Desired camera offset relative to character position
    const baseOffsetX = this.isMobile ? 0.4 : 1.25;
    const baseOffsetY = (this.isMobile ? 2.3 : 2.0) + scrollProgress * 1.5;
    const baseOffsetZ = (this.isMobile ? 5.8 : 4.8) - scrollProgress * 1.2;

    this.targetPos.set(
      characterPos.x + baseOffsetX + this.mouseOffset.x + breathX,
      characterPos.y + baseOffsetY + this.mouseOffset.y + breathY,
      characterPos.z + baseOffsetZ
    );

    // Damped camera follow
    const followLerp = Math.min(delta * 3.5, 0.2);
    this.camera.position.lerp(this.targetPos, followLerp);

    // Look ahead down the route toward the illuminated gateway
    this.targetLookAt.set(
      characterPos.x * 0.4 + this.mouseOffset.x * 0.5,
      characterPos.y + 1.6 + scrollProgress * 1.4,
      characterPos.z - 18
    );

    this.currentLookAt.lerp(this.targetLookAt, followLerp);
    this.camera.lookAt(this.currentLookAt);
  }

  public dispose(): void {
    // No explicit memory buffer in camera, but lifecycle method preserved
  }
}
