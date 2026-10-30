import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass } from 'lucide-react';
import { JOURNEY_CHECKPOINTS } from '../../config/journey.config';
import { CheckpointPanel } from './CheckpointPanel';
import { JourneyFallback } from './JourneyFallback';
import styles from './StorytellingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const Journey3DScene = lazy(() =>
  import('./Journey3DScene').then((m) => ({ default: m.Journey3DScene }))
);

export const StorytellingSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState<number>(0);

  const [webGlSupported] = useState<boolean>(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotion);

    if (prefersReducedMotion || !webGlSupported) return;

    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Threshold determination for active checkpoint
          let idx = 0;
          if (p >= 0.84) {
            idx = 3;
          } else if (p >= 0.56) {
            idx = 2;
          } else if (p >= 0.28) {
            idx = 1;
          } else {
            idx = 0;
          }
          setActiveCheckpointIndex(idx);
        },
      });
    }, track);

    return () => {
      ctx.revert();
      mediaQuery.removeEventListener('change', handleMotion);
    };
  }, [prefersReducedMotion, webGlSupported]);

  // Jump to checkpoint when clicking HUD dots
  const handleSelectCheckpoint = (targetIdx: number) => {
    const track = trackRef.current;
    if (!track) return;

    const targetProgress = JOURNEY_CHECKPOINTS[targetIdx].progress;
    const trackTop = track.offsetTop;
    const trackHeight = track.clientHeight - window.innerHeight;
    const targetScroll = trackTop + targetProgress * trackHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const currentCheckpoint = JOURNEY_CHECKPOINTS[activeCheckpointIndex];

  return (
    <section
      id="story"
      className={styles.storyWrapper}
      aria-label="The Walkathon Interactive Journey Road"
    >
      {prefersReducedMotion || !webGlSupported ? (
        <JourneyFallback />
      ) : (
        <div ref={trackRef} className={styles.scrollTrackContainer}>
          <div className={styles.stickyViewport}>
            {/* 3D Daylight Connected Road & Runner Scene */}
            <Suspense fallback={<JourneyFallback />}>
              <Journey3DScene
                progress={progress}
                activeCheckpointIndex={activeCheckpointIndex}
              />
            </Suspense>

            {/* Framing Vignette */}
            <div className={styles.vignetteOverlay} aria-hidden="true" />

            {/* Top Floating Journey Header */}
            <header className={styles.journeyHeader}>
              <div className={styles.headerTextGroup}>
                <div className={styles.journeyEyebrow}>
                  <Compass size={14} />
                  <span>The Walkathon Road • Live Interactive Course</span>
                </div>
                <h2 className={styles.journeyTitle}>
                  From A Single Spark to 10,000 Unified Steps
                </h2>
              </div>

              {/* Progress Timeline HUD */}
              <div className={styles.journeyHud} role="navigation" aria-label="Course checkpoints">
                <div className={styles.hudTrack}>
                  {JOURNEY_CHECKPOINTS.map((cp, idx) => (
                    <button
                      key={cp.id}
                      type="button"
                      className={`${styles.hudStepBtn} ${
                        idx === activeCheckpointIndex ? styles.hudStepActive : ''
                      }`}
                      onClick={() => handleSelectCheckpoint(idx)}
                      aria-label={`Scroll to ${cp.tag}`}
                    >
                      <span>{cp.number}</span>
                      <span>{cp.phase}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.hudProgressBar}>
                  <div
                    className={styles.hudProgressFill}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            </header>

            {/* Floating Checkpoint Content Card Stage */}
            <div className={styles.panelStage}>
              <div className={styles.panelCardWrapper}>
                <CheckpointPanel
                  checkpoint={currentCheckpoint}
                  totalCheckpoints={JOURNEY_CHECKPOINTS.length}
                  currentIndex={activeCheckpointIndex}
                  onSelectCheckpoint={handleSelectCheckpoint}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
