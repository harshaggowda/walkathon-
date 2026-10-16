import React from 'react';
import {
  Users,
  Calendar,
  MapPin,
  ShieldCheck,
  Award,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './HighlightsSection.module.css';

export const HighlightsSection: React.FC = () => {
  const getHighlightIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users size={22} />;
      case 'Calendar':
        return <Calendar size={22} />;
      case 'MapPin':
        return <MapPin size={22} />;
      case 'ShieldCheck':
        return <ShieldCheck size={22} />;
      case 'Award':
        return <Award size={22} />;
      case 'Activity':
        return <Activity size={22} />;
      default:
        return <Sparkles size={22} />;
    }
  };

  return (
    <section id="highlights" className={styles.highlightsWrapper} aria-label="Event Highlights & Distances">
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Layers size={14} />
            <span>Event Blueprint & Logistics</span>
          </div>
          <h2 className="section-title">Engineered for Scale, Safety & Inclusion</h2>
          <p className="section-lead">
            Carefully structured parameters to support 20,000 registrations and deliver an unforgettable morning for every participant.
          </p>
        </div>

        {/* Distance Categories */}
        <div className={styles.categoriesGrid}>
          {EVENT_CONFIG.scale.distanceCategories.map((cat) => (
            <article key={cat.id} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryDistance}>{cat.distanceKm}K</span>
                {cat.isTentative && (
                  <span className="badge badge-tentative">Provisional</span>
                )}
              </div>
              <h3 className={styles.categoryTitle}>{cat.name}</h3>
              <p className={styles.categoryDesc}>{cat.description}</p>

              <div className={styles.categoryFooter}>
                <span className={styles.eligibilityText}>
                  <strong>Eligibility:</strong> {cat.eligibility}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Operational Highlights */}
        <div className={styles.highlightsGrid}>
          {EVENT_CONFIG.highlights.map((item) => (
            <div key={item.id} className={styles.highlightItemCard}>
              <div className={styles.highlightIconBox} aria-hidden="true">
                {getHighlightIcon(item.icon)}
              </div>

              <div className={styles.highlightDetails}>
                <div className={styles.highlightTop}>
                  <span className={styles.highlightTitle}>{item.title}</span>
                  <span
                    className={`badge ${
                      item.status === 'confirmed' ? 'badge-confirmed' : 'badge-tentative'
                    }`}
                  >
                    {item.statusLabel}
                  </span>
                </div>
                <div className={styles.highlightValue}>{item.value}</div>
                <div className={styles.highlightSubtitle}>{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
