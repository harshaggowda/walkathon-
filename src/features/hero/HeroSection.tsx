import React, { Suspense, lazy } from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import { HeroFallback } from './HeroFallback';
import styles from './HeroSection.module.css';

const Hero3DScene = lazy(() =>
  import('./Hero3DScene').then((m) => ({ default: m.Hero3DScene }))
);

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className={styles.heroWrapper} aria-label="Walkathon Hero Introduction">
      {/* 3D WebGL Canvas Scene with instant fallback */}
      <Suspense fallback={<HeroFallback />}>
        <Hero3DScene />
      </Suspense>

      {/* Atmospheric Radial Vignette */}
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* Hero Editorial Content */}
      <div className={`container ${styles.heroContent}`}>
        {/* Status / Edition Eyebrow */}
        <div className={styles.heroBadge} role="status">
          <span className={styles.pulseDot} aria-hidden="true" />
          <span>{EVENT_CONFIG.branding.badgeText}</span>
        </div>

        {/* Hero Headline */}
        <h1 className={styles.heroHeadline}>
          <span className={styles.headlineGradient}>{EVENT_CONFIG.branding.headline}</span>
        </h1>

        {/* Supporting Line & Vision */}
        <p className={styles.heroSupporting}>
          <strong>{EVENT_CONFIG.branding.supportingLine}</strong>
          <span className={styles.heroSubphrase}>
            {EVENT_CONFIG.branding.subheadline}
          </span>
        </p>

        {/* Call to Actions */}
        <div className={styles.heroCtas}>
          <a href="#register" className="btn btn-primary btn-lg" id="hero-primary-cta">
            <span>Register (Google Form)</span>
            <ArrowRight size={20} />
          </a>

          <a href="#story" className="btn btn-secondary btn-lg" id="hero-secondary-cta">
            <Sparkles size={18} />
            <span>Discover the Movement</span>
          </a>
        </div>

        {/* Highlights Stat Preview Bar */}
        <div className={styles.heroStatsBar} aria-label="Event key scale figures">
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {EVENT_CONFIG.scale.targetRegistrations.toLocaleString()}+
            </span>
            <span className={styles.statLabel}>Target Registrations</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {EVENT_CONFIG.scale.expectedParticipants.toLocaleString()}+
            </span>
            <span className={styles.statLabel}>Expected Participants</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statValue}>{EVENT_CONFIG.timing.displayDate}</span>
            <span className={styles.statLabel}>Tentative Schedule</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a href="#story" className={styles.scrollIndicator} aria-label="Scroll to The Journey section">
        <span>Scroll to Explore</span>
        <div className={styles.scrollTrack} aria-hidden="true">
          <div className={styles.scrollWheel} />
        </div>
        <ChevronDown size={14} />
      </a>
    </section>
  );
};
