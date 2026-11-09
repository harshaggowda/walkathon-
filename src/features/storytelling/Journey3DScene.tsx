import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { JourneyRoad } from './JourneyRoad';
import { JourneyRunner } from './JourneyRunner';
import styles from './StorytellingSection.module.css';

interface Journey3DSceneProps {
  progress: number;
  activeCheckpointIndex: number;
}

export const Journey3DScene: React.FC<Journey3DSceneProps> = ({
  progress,
  activeCheckpointIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<JourneyRoad | null>(null);
  const runnerRef = useRef<JourneyRunner | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const progressRef = useRef<number>(progress);
  const activeIdxRef = useRef<number>(activeCheckpointIndex);

  // Sync refs with latest props without re-initializing WebGL context
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    activeIdxRef.current = activeCheckpointIndex;
  }, [activeCheckpointIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Bright Outdoor Daylight Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdbeafe); // Warm daylight sky blue
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.016);

    // 2. Camera: Elevated three-quarter sports broadcast angle
    const initialFov = window.innerWidth < 768 ? 50 : 48;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 800);
    cameraRef.current = camera;
    camera.position.set(4, 5, 24);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Warm Outdoor Lighting Scheme
    const skyLight = new THREE.AmbientLight(0xbae6fd, 1.4); // Sky fill
    scene.add(skyLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.8); // Golden morning sun
    sunLight.position.set(15, 28, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xfef08a, 1.2); // Warm road fill
    fillLight.position.set(-14, 16, -10);
    scene.add(fillLight);

    // 5. Build Continuous Road & Runner
    const road = new JourneyRoad();
    roadRef.current = road;
    scene.add(road.group);

    const runner = new JourneyRunner();
    runnerRef.current = runner;
    scene.add(runner.group);
    runner.load();

    // 6. Subtle Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handling: sync camera and renderer to container dimensions across breakpoints
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      if (newW === 0 || newH === 0) return;

      const cam = cameraRef.current;
      const rnd = rendererRef.current;

      cam.aspect = newW / newH;
      if (window.innerWidth < 768) {
        cam.fov = 50;
      } else if (window.innerWidth < 1024) {
        cam.fov = 48;
      } else {
        cam.fov = 48;
      }
      cam.updateProjectionMatrix();
      rnd.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => handleResize())
      : null;
    if (resizeObserver && container) {
      resizeObserver.observe(container);
    }

    // 7. Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    const currentLookAt = new THREE.Vector3(0, 1.5, 0);
    const targetLookAt = new THREE.Vector3(0, 1.5, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.08);
      const time = now / 1000;
      lastTime = now;

      const p = progressRef.current;
      const activeIdx = activeIdxRef.current;

      // Update runner along road curve
      const { position, tangent } = runner.update(p, delta, road.curve);

      // Update road checkpoints and flags
      road.update(activeIdx, time);

      // Smooth mouse parallax damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Dynamic camera tracking:
      // Desktop: Camera positioned to the left of the runner aiming forward-right,
      // ensuring the road and runner are clearly framed on the right half,
      // completely clear of the left-hand checkpoint mission cards.
      // Mobile & Tablet: Centered follow in dedicated upper viewport.
      const winW = window.innerWidth;
      const isDesktop = winW >= 1024;
      const isMobile = winW < 768;

      const camOffsetX = isDesktop
        ? -1.8 + currentMouseX * 0.3
        : 0;
      const camOffsetY = isMobile
        ? 3.6
        : (isDesktop ? 3.2 - currentMouseY * 0.2 : 3.4);
      const camOffsetZ = isMobile ? 6.0 : 5.6;

      const targetCamPos = new THREE.Vector3(
        position.x + camOffsetX,
        position.y + camOffsetY,
        position.z + camOffsetZ
      );

      camera.position.lerp(targetCamPos, Math.min(delta * 4, 0.2));

      // Camera look-at target: slightly ahead of runner down the road
      targetLookAt.set(
        position.x + tangent.x * 5.5 + (isDesktop ? 0.6 : 0),
        position.y + 1.35,
        position.z + tangent.z * 5.5
      );

      currentLookAt.lerp(targetLookAt, Math.min(delta * 4, 0.2));
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      runner.dispose();
      road.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.canvasContainer}
      aria-hidden="true"
    />
  );
};
export default Journey3DScene;
