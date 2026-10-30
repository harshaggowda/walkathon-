import React, { useState } from 'react';
import { Footprints, Mail, Clock } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import { Modal } from '../ui/Modal';
import styles from './Footer.module.css';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const [legalModalContent, setLegalModalContent] = useState<{
    title: string;
    text: string;
  } | null>(null);

  const openPrivacyModal = () => {
    setLegalModalContent({
      title: 'Provisional Privacy Policy',
      text: 'Phase 1 Architecture Policy: This website does not process commercial transactions, nor does it collect or sell personal identifiable information. Registrations are conducted securely on Google Forms pursuant to Google Privacy policies. Any email alerts submitted in demo mode are discarded client-side in Phase 1.',
    });
  };

  const openTermsModal = () => {
    setLegalModalContent({
      title: 'Event Terms & Participation Charter',
      text: 'Event Guidelines (Provisional Draft): Participation is voluntary and subject to medical clearance by the participant. Event routes, timing, and hydration zones are subject to municipal approvals and traffic authority permits. Full liability waiver documents will be executed via registration forms prior to bib distribution.',
    });
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <div className={styles.brandIcon} aria-hidden="true">
                <Footprints size={20} strokeWidth={2.5} />
              </div>
              <span className={styles.brandTitle}>{EVENT_CONFIG.branding.shortName}</span>
            </div>

            <p className={styles.brandDesc}>
              A premier mass-participation civic walking movement uniting 10,000+ citizens for health, harmony, and community vitality.
            </p>

            <div className={styles.provisionalNotice}>
              Organized under the initiative of {EVENT_CONFIG.branding.organizerName} (Provisional)
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className={styles.footerColTitle}>Navigation</h4>
            <ul className={styles.footerNavList}>
              {EVENT_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.footerNavLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Secretariat Contact */}
          <div>
            <h4 className={styles.footerColTitle}>Secretariat</h4>
            <div className={styles.contactInfoBox}>
              <div className={styles.contactItem}>
                <Mail size={16} color="var(--accent-orange-light)" />
                <span>{EVENT_CONFIG.contact.inquiryEmail}</span>
              </div>
              <div className={styles.contactItem}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>{EVENT_CONFIG.contact.hours}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {EVENT_CONFIG.contact.notice}
              </p>
            </div>
          </div>

          {/* Social Channels & Status */}
          <div>
            <h4 className={styles.footerColTitle}>Community Channels</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Official social channels will be linked upon formal event launch.
            </p>
            <div className={styles.socialRow}>
              {EVENT_CONFIG.socialLinks.map((s) => (
                <span key={s.platform} className={styles.socialPill} title="Provisional handle">
                  <span>{s.platform}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>(Pending)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {CURRENT_YEAR} {EVENT_CONFIG.branding.name}. All rights reserved.
          </div>

          <div className={styles.legalLinks}>
            <button
              type="button"
              className={styles.legalLinkBtn}
              onClick={openPrivacyModal}
            >
              Privacy Policy (Draft)
            </button>
            <button
              type="button"
              className={styles.legalLinkBtn}
              onClick={openTermsModal}
            >
              Terms of Participation
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Privacy & Terms */}
      {legalModalContent && (
        <Modal
          isOpen={!!legalModalContent}
          onClose={() => setLegalModalContent(null)}
          title={legalModalContent.title}
          badge="Legal Framework • Phase 1 Preview"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>{legalModalContent.text}</p>
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              {EVENT_CONFIG.legalDisclaimer}
            </div>
          </div>
        </Modal>
      )}
    </footer>
  );
};
