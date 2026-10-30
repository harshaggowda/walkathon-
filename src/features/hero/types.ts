import * as THREE from 'three';

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export interface CharacterUpdateState {
  delta: number;
  time: number;
  scrollProgress: number;
}

export interface RoutePoint {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
}
