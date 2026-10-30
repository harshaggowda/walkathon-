import React from 'react';
import { Footprints, Users, Activity, Award, ArrowRight, Sparkles } from 'lucide-react';
import type { JourneyCheckpoint } from '../../config/journey.config';
import { CheckpointIllustration } from './CheckpointIllustrations';
import styles from './StorytellingSection.module.css';

interface CheckpointPanelProps {
  checkpoint: JourneyCheckpoint;
  totalCheckpoints: number;
  currentIndex: number;
  onSelectCheckpoint: (index: number) => void;
}

export const CheckpointPanel: React.FC<CheckpointPanelProps> = ({
  checkpoint,
  totalCheckpoints,
  currentIndex,
  onSelectCheckpoint,
}) => {
  const getIcon = () => {
    switch (checkpoint.iconName) {
      case 'Footprints':
        return <Footprints size={18} />;
      case 'Users':
        return <Users size={18} />;
      case 'Activity':
        return <Activity size={18} />;
      case 'Award':
        return <Award size={18} />;
    }
  };

  return (
    <div className={styles.panelCard} key={checkpoint.id}>
      {/* Top Header Row with Milestone Counter & Waypoint Pills */}
      <div className={styles.panelHeader}>
        <div
          className={styles.checkpointBadge}
          style={{
            backgroundColor: checkpoint.badgeBg,
            borderColor: `${checkpoint.themeColor}55`,
            color: checkpoint.themeColor,
          }}
        >
          {getIcon()}
          <span>{checkpoint.tag} • {checkpoint.phase}</span>
        </div>

        {/* Interactive Step Switcher */}
        <div className={styles.stepDots} aria-label="Journey checkpoints">
          {Array.from({ length: totalCheckpoints }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.stepDot} ${idx === currentIndex ? styles.stepDotActive : ''}`}
              style={{
                backgroundColor: idx === currentIndex ? checkpoint.themeColor : undefined,
              }}
              onClick={() => onSelectCheckpoint(idx)}
              aria-label={`Jump to Checkpoint ${idx + 1}`}
              aria-current={idx === currentIndex ? 'step' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Checkpoint Artwork Card */}
      <div className={styles.panelArtworkWrapper}>
        <CheckpointIllustration
          type={checkpoint.illustrationType}
          className={styles.panelArtwork}
        />
        <div
          className={styles.artworkMetricBadge}
          style={{ borderLeftColor: checkpoint.themeColor }}
        >
          <span className={styles.metricVal} style={{ color: checkpoint.themeColor }}>
            {checkpoint.metricValue}
          </span>
          <span className={styles.metricLbl}>{checkpoint.metricLabel}</span>
        </div>
      </div>

      {/* Checkpoint Editorial Content */}
      <div className={styles.panelBody}>
        <h3 className={styles.panelHeadline}>{checkpoint.headline}</h3>
        <p className={styles.panelLead}>{checkpoint.lead}</p>
        <p className={styles.panelDescription}>{checkpoint.description}</p>
      </div>

      {/* Checkpoint Action: If finish line, prominent Registration CTA */}
      {checkpoint.cta && (
        <div className={styles.panelActionArea}>
          <a
            href={checkpoint.cta.href}
            className="btn btn-primary btn-lg"
            id="journey-destination-cta"
          >
            <span>{checkpoint.cta.label}</span>
            <ArrowRight size={18} />
          </a>
          <span className={styles.ctaHint}>
            <Sparkles size={14} />
            <span>Pre-registration is free and non-monetized</span>
          </span>
        </div>
      )}
    </div>
  );
};
