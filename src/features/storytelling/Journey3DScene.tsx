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

    // 1. Scene & Photorealistic Outdoor Daylight Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdceefb);
    scene.fog = new THREE.Fog(0xdceefb, 42, 135);

    // Natural Sky Dome with smooth horizon daylight gradient
    const skyGeo = new THREE.SphereGeometry(280, 32, 20);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x3b82f6) }, // Rich clear sky blue
        midColor: { value: new THREE.Color(0x93c5fd) }, // Soft cyan-azure
        bottomColor: { value: new THREE.Color(0xfef3c7) }, // Warm golden horizon dawn
        offset: { value: 15 },
        exponent: { value: 0.75 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          float t = max(pow(max(h, 0.0), exponent), 0.0);
          vec3 sky = mix(bottomColor, mix(midColor, topColor, t), t);
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // 2. Camera: Elevated three-quarter sports broadcast angle
    const initialFov = window.innerWidth < 768 ? 50 : 48;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 800);
    cameraRef.current = camera;
    camera.position.set(4, 5, 24);

    // 3. Renderer with high dynamic range color grading
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Natural Daylight Lighting Scheme
    const hemiLight = new THREE.HemisphereLight(0xbfe0fd, 0x6e965f, 1.35); // Sky / green grass bounce
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.7); // Warm golden morning sunlight
    sunLight.position.set(22, 34, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0006;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xfef9c3, 0.95); // Soft secondary road fill
    fillLight.position.set(-18, 16, -14);
    scene.add(fillLight);

    // 4b. Floating Golden Sun Pollen / Breeze Particle System
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 45;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 6.5;
      particlePositions[i * 3 + 2] = 20 - Math.random() * 110;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfff3b0,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

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
    const applyResponsiveFraming = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      if (newW === 0 || newH === 0) return;

      const cam = cameraRef.current;
      const rnd = rendererRef.current;

      cam.aspect = newW / newH;
      rnd.setSize(newW, newH);

      if (window.innerWidth >= 1024) {
        cam.fov = 48;
        // Shift 3D optical axis to right ~69% of viewport, reserving left 38% for card
        const shiftX = -Math.round(newW * 0.19);
        cam.setViewOffset(newW, newH, shiftX, 0, newW, newH);
      } else {
        cam.fov = window.innerWidth < 768 ? 52 : 48;
        cam.clearViewOffset();
      }
      cam.updateProjectionMatrix();
    };

    applyResponsiveFraming();
    window.addEventListener('resize', applyResponsiveFraming);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => applyResponsiveFraming())
      : null;
    if (resizeObserver && container) {
      resizeObserver.observe(container);
    }

    // 7. Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    const currentLookAt = new THREE.Vector3(0, 1.5, 0);
    const targetLookAt = new THREE.Vector3(0, 1.5, 0);
    const upVec = new THREE.Vector3(0, 1, 0);
    const binormalVec = new THREE.Vector3();

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
      // Perfectly tracks directly behind runner along road curve tangent.
      // Symmetrical camera alignment ensures runner and road remain in optical center.
      // On desktop, setViewOffset projects this center onto the right ~69% of screen,
      // completely clear of the left-hand checkpoint mission cards.
      // On mobile & tablet portrait, clearViewOffset keeps it centered in upper viewport.
      const isMobile = window.innerWidth < 768;
      binormalVec.crossVectors(tangent, upVec).normalize();

      const camDist = isMobile ? 6.2 : 5.8;
      const camHeight = isMobile ? 3.6 : (3.2 - currentMouseY * 0.25);

      const targetCamPos = position.clone()
        .addScaledVector(tangent, -camDist)
        .addScaledVector(upVec, camHeight)
        .addScaledVector(binormalVec, currentMouseX * 0.35);

      camera.position.lerp(targetCamPos, Math.min(delta * 4, 0.2));

      targetLookAt.copy(position)
        .addScaledVector(tangent, 5.5)
        .addScaledVector(upVec, 1.35);

      currentLookAt.lerp(targetLookAt, Math.min(delta * 4, 0.2));
      camera.lookAt(currentLookAt);

      // Subtle airborne breeze drift on floating sun pollen particles
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 1] += Math.sin(time * 0.8 + i) * 0.003;
        pPositions[i * 3] += Math.cos(time * 0.5 + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', applyResponsiveFraming);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particleGeo.dispose();
      particleMat.dispose();
      skyGeo.dispose();
      skyMat.dispose();
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
