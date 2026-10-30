import React, { useState } from 'react';
import { Footprints, Users, Activity, Award, ArrowRight } from 'lucide-react';
import { JOURNEY_CHECKPOINTS } from '../../config/journey.config';
import { CheckpointIllustration } from './CheckpointIllustrations';
import styles from './StorytellingSection.module.css';

export const JourneyFallback: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = JOURNEY_CHECKPOINTS[activeIdx];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Footprints':
        return <Footprints size={18} />;
      case 'Users':
        return <Users size={18} />;
      case 'Activity':
        return <Activity size={18} />;
      default:
        return <Award size={18} />;
    }
  };

  return (
    <div className={styles.fallbackWrapper}>
      {/* Visual Roadmap Stepper Header */}
      <div className={styles.fallbackRoadmapTrack} role="tablist" aria-label="Journey Milestones">
        {JOURNEY_CHECKPOINTS.map((cp, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={cp.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${cp.id}`}
              className={`${styles.roadmapNodeBtn} ${isActive ? styles.roadmapNodeActive : ''}`}
              onClick={() => setActiveIdx(idx)}
            >
              <div
                className={styles.nodeIconCircle}
                style={{
                  backgroundColor: isActive ? cp.themeColor : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  borderColor: cp.themeColor,
                }}
              >
                {getIcon(cp.iconName)}
              </div>
              <span className={styles.nodeLabel}>{cp.number} • {cp.phase}</span>
            </button>
          );
        })}
      </div>

      {/* Active Checkpoint Content Card */}
      <div
        id={`panel-${current.id}`}
        role="tabpanel"
        className={styles.fallbackCard}
      >
        <div className={styles.fallbackCardGrid}>
          <div className={styles.fallbackGraphicCol}>
            <CheckpointIllustration type={current.illustrationType} className={styles.panelArtwork} />
            <div className={styles.fallbackMetric}>
              <span className={styles.fallbackMetricVal} style={{ color: current.themeColor }}>
                {current.metricValue}
              </span>
              <span className={styles.fallbackMetricLbl}>{current.metricLabel}</span>
            </div>
          </div>

          <div className={styles.fallbackContentCol}>
            <div
              className={styles.checkpointBadge}
              style={{
                backgroundColor: current.badgeBg,
                borderColor: `${current.themeColor}55`,
                color: current.themeColor,
              }}
            >
              {getIcon(current.iconName)}
              <span>{current.tag} • {current.phase}</span>
            </div>

            <h3 className={styles.panelHeadline}>{current.headline}</h3>
            <p className={styles.panelLead}>{current.lead}</p>
            <p className={styles.panelDescription}>{current.description}</p>

            {current.cta && (
              <div style={{ marginTop: '1.5rem' }}>
                <a href={current.cta.href} className="btn btn-primary btn-lg">
                  <span>{current.cta.label}</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
