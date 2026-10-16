import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeroFallback } from './HeroFallback';
import styles from './HeroSection.module.css';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    // Check WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl =
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080c16, 0.028);

    // CAMERA SETUP
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 22);

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // LIGHTING: Studio dramatic athletic setup
    const ambientLight = new THREE.AmbientLight(0x0c1938, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff5722, 3.2); // Warm Energetic Orange
    dirLight1.position.set(12, 16, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf5a623, 1.8); // Athletic Gold Fill
    dirLight2.position.set(-14, -8, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00e5ff, 2.4, 40); // Cyan Vitality Accent
    pointLight.position.set(0, -6, 8);
    scene.add(pointLight);

    // GROUP FOR PARALLAX ROTATION
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // 1. PROCEDURAL 3D CURVE (Möbius-inspired continuous athletic track)
    const curvePoints: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i < segments; i++) {
      const u = (i / segments) * Math.PI * 2;
      const x = Math.sin(u) * 9 + Math.sin(u * 2) * 2.5;
      const y = Math.cos(u * 2) * 3.8 + Math.sin(u) * 1.5;
      const z = Math.cos(u) * 6.5 + Math.sin(u * 3) * 1.8;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const pathCurve = new THREE.CatmullRomCurve3(curvePoints, true, 'centripetal');

    // PRIMARY ROUTE RIBBON (TUBE)
    const tubeGeometry = new THREE.TubeGeometry(pathCurve, 200, 0.42, 16, true);
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5722,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x441100,
      emissiveIntensity: 0.45,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    trackGroup.add(tubeMesh);

    // SECONDARY ACCENT WIRE/BEAM
    const innerTubeGeometry = new THREE.TubeGeometry(pathCurve, 160, 0.12, 8, true);
    const innerTubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5a623,
      emissive: 0xf5a623,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const innerTubeMesh = new THREE.Mesh(innerTubeGeometry, innerTubeMaterial);
    innerTubeMesh.position.y += 0.25;
    trackGroup.add(innerTubeMesh);

    // 2. PARTICIPANT ENERGY SPARKS (Streaming crowd particles)
    const particleCount = 1400;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorOrange = new THREE.Color(0xff7043);
    const colorGold = new THREE.Color(0xf5a623);
    const colorCyan = new THREE.Color(0x00e5ff);

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount + Math.random() * 0.05) % 1;
      const pt = pathCurve.getPointAt(t);

      // Disperse slightly around the ribbon
      const spread = 1.4;
      const px = pt.x + (Math.random() - 0.5) * spread;
      const py = pt.y + (Math.random() - 0.5) * spread;
      const pz = pt.z + (Math.random() - 0.5) * spread;

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      const mixVal = Math.random();
      const chosenColor = mixVal < 0.5 ? colorOrange : mixVal < 0.85 ? colorGold : colorCyan;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    trackGroup.add(particles);

    // INTERACTION & PARALLAX
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isVisible = true;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = normX * 0.45;
      targetRotationX = -normY * 0.35;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Observer to pause animation when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ANIMATION LOOP
    let animationFrameId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      const time = (now - startTime) / 1000;
      lastTime = now;

      // Continuous gentle track rotation symbolizing ongoing movement
      trackGroup.rotation.y += delta * 0.12;

      // Smooth mouse parallax damping
      trackGroup.rotation.y += (targetRotationY - trackGroup.rotation.y * 0.2) * 0.03;
      trackGroup.rotation.x += (targetRotationX - trackGroup.rotation.x * 0.2) * 0.03;

      // Subtle dynamic breathing wave
      innerTubeMesh.rotation.z = Math.sin(time * 0.6) * 0.1;
      particles.rotation.y = time * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      tubeGeometry.dispose();
      tubeMaterial.dispose();
      innerTubeGeometry.dispose();
      innerTubeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  if (prefersReducedMotion || !webGlSupported) {
    return <HeroFallback />;
  }

  return (
    <div
      ref={containerRef}
      className={styles.threeCanvasContainer}
      aria-hidden="true"
    />
  );
};
