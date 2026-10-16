import React, { useState } from 'react';
import { Bell, ArrowRight, Info } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import type { Announcement } from '../../types/event';
import { Modal } from '../../components/ui/Modal';
import styles from './AnnouncementsSection.module.css';

export const AnnouncementsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const categories = ['All', 'Official', 'Health & Safety', 'Community'];

  const filteredAnnouncements =
    activeCategory === 'All'
      ? EVENT_CONFIG.announcements
      : EVENT_CONFIG.announcements.filter((a) => a.category === activeCategory);

  return (
    <section
      id="announcements"
      className={styles.announcementsWrapper}
      aria-label="Official Bulletins and Announcements"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Bell size={14} />
            <span>Secretariat Bulletins</span>
          </div>
          <h2 className="section-title">Latest Updates & Notices</h2>
          <p className="section-lead">
            Stay informed on planning milestones, municipal coordinations, and community engagement schedules.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className={styles.filterTabs} role="tablist" aria-label="Announcement categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`${styles.filterBtn} ${
                activeCategory === cat ? styles.filterBtnActive : ''
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid or Empty State */}
        {filteredAnnouncements.length > 0 ? (
          <div className={styles.announcementsGrid}>
            {filteredAnnouncements.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <time className={styles.dateText}>{item.date}</time>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSummary}>{item.summary}</p>

                <div className={styles.cardAction}>
                  <button
                    type="button"
                    className={styles.readMoreBtn}
                    onClick={() => setSelectedAnnouncement(item)}
                    aria-label={`Read full notice: ${item.title}`}
                  >
                    <span>Read Full Bulletin</span>
                    <ArrowRight size={16} />
                  </button>

                  {item.isSample && (
                    <span className={styles.sampleBadge}>Preview Sample</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No Bulletins in this Category</h3>
            <p className={styles.emptyText}>
              There are currently no updates filed under "{activeCategory}". Check back as the organizing committee releases new notifications.
            </p>
          </div>
        )}

        {/* Informational Disclaimer Banner */}
        <div className={styles.disclaimerBanner} role="note">
          <Info size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Phase 1 Notice:</strong> The bulletins displayed above represent illustrative sample datasets to preview the digital bulletin feed. Official organizer communiques will be synchronized via the future backend API.
          </span>
        </div>
      </div>

      {/* Modal for Bulletin Details */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={selectedAnnouncement.title}
          badge={`${selectedAnnouncement.category} • ${selectedAnnouncement.date}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-ivory)', fontWeight: 500 }}>
              {selectedAnnouncement.summary}
            </p>
            <p>{selectedAnnouncement.body}</p>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              Organizing Secretariat Reference: {selectedAnnouncement.id.toUpperCase()} • Issued for Phase 1 Architecture Preview.
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
