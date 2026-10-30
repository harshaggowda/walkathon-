import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CharacterController } from './CharacterController';
import { RoutePath } from './RoutePath';
import { DestinationGateway } from './DestinationGateway';
import { EnvironmentLighting } from './EnvironmentLighting';
import { CameraRig } from './CameraRig';
import { HeroFallback } from './HeroFallback';
import styles from './HeroSection.module.css';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported] = useState<boolean>(() => {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  useEffect(() => {
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    if (prefersReducedMotion || !webGlSupported) return;

    const container = containerRef.current;
    if (!container) return;

    // SCENE INITIALIZATION
    const scene = new THREE.Scene();

    // DIMENSIONS & CAMERA RIG
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const cameraRig = new CameraRig(width, height);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // MODULAR SCENE SUBSYSTEMS
    const environment = new EnvironmentLighting(scene);
    scene.add(environment.group);

    const routePath = new RoutePath();
    scene.add(routePath.group);

    const destination = new DestinationGateway(new THREE.Vector3(0, 0, -55));
    scene.add(destination.group);

    const character = new CharacterController();
    scene.add(character.group);

    // Load rigged animated human character
    character.load();

    // INTERACTION STATE
    let isVisible = true;
    let scrollProgress = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      cameraRig.setPointer(normX, normY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // SCROLL PROGRESSION
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = container.clientHeight || window.innerHeight;
      // Normalized progress 0 to 1 across hero section scroll
      scrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // RESIZE HANDLING
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      cameraRig.setDimensions(width, height);
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // INTERSECTION OBSERVER FOR GPU EFFICIENCY
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
      const delta = Math.min((now - lastTime) / 1000, 0.08);
      const time = (now - startTime) / 1000;
      lastTime = now;

      // 1. Update Character stride and curve position
      const charUpdate = character.update(
        { delta, time, scrollProgress },
        routePath.curve
      );

      // 2. Update Route glowing pulses
      routePath.update(time);

      // 3. Update Destination sky beams and beacon
      destination.update(time);

      // 4. Update Atmospheric lighting & follow spotlight
      environment.update(time, charUpdate.characterPosition);

      // 5. Update Camera framing & parallax follow
      cameraRig.update(charUpdate.characterPosition, scrollProgress, delta);

      // 6. Render Frame
      renderer.render(scene, cameraRig.camera);
    };

    animate();

    // DISPOSAL & CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
      observer.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      character.dispose();
      routePath.dispose();
      destination.dispose();
      environment.dispose();
      cameraRig.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, webGlSupported]);

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
export default Hero3DScene;
