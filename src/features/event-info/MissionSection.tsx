import React from 'react';
import { Heart, Users2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './MissionSection.module.css';

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className={styles.missionWrapper} aria-label="Event Purpose and Mission">
      <div className="container">
        <div className={styles.missionGrid}>
          {/* Editorial Column */}
          <div className={styles.missionEditorial}>
            <div className={styles.provisionalBadge}>
              <AlertCircle size={14} />
              <span>Mission Charter (Provisional Editorial Draft)</span>
            </div>

            <h2 className={styles.missionQuote}>
              "Walking is not merely exercise. It is the purest assertion of <span>civic vitality and collective goodwill</span>."
            </h2>

            <p className={styles.missionBody}>
              Organized under the initiative of {EVENT_CONFIG.branding.organizerName},{' '}
              {EVENT_CONFIG.branding.name} is conceived as a non-commercial mass mobilization. In an era increasingly dominated by sedentary routines and digital isolation, this walkathon brings citizens together under the open morning sky to celebrate physical fitness, intergenerational harmony, and community resilience.
            </p>

            {/* Core Mission Pillars */}
            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <Heart size={20} />
                </div>
                <h3 className={styles.pillarTitle}>Preventive Vitality</h3>
                <p className={styles.pillarDesc}>
                  Promoting daily aerobic walking as the primary defense against lifestyle ailments across all age demographics.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <Users2 size={20} />
                </div>
                <h3 className={styles.pillarTitle}>Civic Harmony</h3>
                <p className={styles.pillarDesc}>
                  Uniting diverse communities, student clubs, and senior circles along a shared scenic metropolitan route.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <ShieldCheck size={20} />
                </div>
                <h3 className={styles.pillarTitle}>Zero Monitization</h3>
                <p className={styles.pillarDesc}>
                  Free, unmonetized registration ensuring economic barriers never preclude community participation.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <Sparkles size={20} />
                </div>
                <h3 className={styles.pillarTitle}>Intergenerational Spirit</h3>
                <p className={styles.pillarDesc}>
                  Grandparents, parents, and children walking stride-by-stride, reaffirming shared heritage and optimism.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Composition Column */}
          <div className={styles.visualComposition}>
            <div className={styles.compositionFrame}>
              <div className={styles.compositionGlow} aria-hidden="true" />

              {/* Graphic Center Piece */}
              <div className={styles.graphicCenter}>
                <svg
                  viewBox="0 0 320 320"
                  width="100%"
                  height="100%"
                  fill="none"
                  aria-hidden="true"
                  style={{ maxHeight: '280px' }}
                >
                  <circle cx="160" cy="160" r="140" stroke="rgba(255, 87, 34, 0.25)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle cx="160" cy="160" r="110" stroke="rgba(245, 166, 35, 0.35)" strokeWidth="2" />
                  <circle cx="160" cy="160" r="75" fill="rgba(19, 31, 58, 0.7)" stroke="#FF5722" strokeWidth="2.5" />
                  
                  {/* Stylized Compass / Stride Motif */}
                  <path d="M 160 100 L 175 160 L 160 145 L 145 160 Z" fill="#FF7043" />
                  <path d="M 160 220 L 175 160 L 160 175 L 145 160 Z" fill="#F5A623" />
                  <circle cx="160" cy="160" r="8" fill="#FFFFFF" />

                  {/* Flowing Ring Path */}
                  <path
                    d="M 60 160 C 60 90, 260 90, 260 160 C 260 230, 60 230, 60 160"
                    stroke="#FF7043"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="18 12"
                  />
                </svg>
              </div>

              {/* Composition Footer Note */}
              <div className={styles.compositionFooter}>
                <p className={styles.compositionFooterText}>
                  <strong>Organizer Notice:</strong> The official mission manifesto is currently under final review by the organizing committee. This editorial copy reflects pre-launch creative framing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
