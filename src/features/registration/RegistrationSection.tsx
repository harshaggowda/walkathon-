import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './RegistrationSection.module.css';

export const RegistrationSection: React.FC = () => {
  const [showEmbedPreview, setShowEmbedPreview] = useState(false);

  return (
    <section
      id="register"
      className={styles.registrationWrapper}
      aria-label="Walkathon Registration"
    >
      <div className="container">
        <div className={styles.registrationBanner}>
          <div className={styles.regContent}>
            {/* Eyebrow Badge */}
            <div className={styles.regBadge}>
              <ShieldCheck size={16} />
              <span>Phase 1 Community Intake • Free Entry</span>
            </div>

            {/* Headline */}
            <h2 className={styles.regTitle}>
              Be Part of the 10,000-Walker Collective
            </h2>

            {/* Supporting Copy */}
            <p className={styles.regSubtitle}>
              Registration is conducted directly via the official Google Forms intake portal.
              Participation is 100% free with no registration fees or commercial obligations.
            </p>

            {/* Action Buttons */}
            <div className={styles.ctaActionsRow}>
              <a
                href={EVENT_CONFIG.registration.googleFormsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                id="registration-google-form-btn"
              >
                <span>Proceed to Google Form</span>
                <ArrowUpRight size={20} />
              </a>

              {EVENT_CONFIG.registration.allowEmbedPreview && (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => setShowEmbedPreview(!showEmbedPreview)}
                  aria-expanded={showEmbedPreview}
                >
                  {showEmbedPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span>{showEmbedPreview ? 'Hide Embed Preview' : 'Preview Embedded Form Layout'}</span>
                </button>
              )}
            </div>

            {/* Transparent Developer & Organizer Status Box */}
            <div className={styles.disclaimerCard} role="region" aria-label="Registration details">
              <div className={styles.disclaimerHeader}>
                <AlertTriangle size={16} />
                <span>Pre-Launch Registration Architecture Notice</span>
              </div>
              <p className={styles.disclaimerText}>
                <strong>Placeholder Notice:</strong> The registration link currently points to the configured organizer placeholder (<code>{EVENT_CONFIG.registration.googleFormsUrl}</code>). When the official Google Form link is issued by the organizing committee, it will be updated in <code>event.config.ts</code> without rebuilding page components.
              </p>
              <p className={styles.disclaimerText}>
                <strong>No Payment Processing:</strong> Online payments are explicitly excluded from Phase 1. Do not submit credit card or financial details.
              </p>
            </div>

            {/* Optional Embed Container Preview */}
            {showEmbedPreview && (
              <div className={styles.embedContainer}>
                <div className={styles.embedHeader}>
                  <span className={styles.embedNotice}>
                    Future Google Forms Embed Frame (Simulated Slot)
                  </span>
                  <span className="badge badge-tentative">Organizer Testing Mode</span>
                </div>

                <div className={styles.embedFramePlaceholder}>
                  <p style={{ color: 'var(--text-ivory)', fontWeight: 600 }}>
                    Google Forms iFrame Sandbox
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px' }}>
                    When approved by the organizer, an iframe will render here directly ({EVENT_CONFIG.registration.googleFormsUrl}). By default in Phase 1, an external linked tab is preferred for mobile responsiveness.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
