import React, { useState, useEffect } from 'react';
import { Footprints, Menu, X, ArrowUpRight } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open and handle ESC key
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
        role="banner"
      >
        <div className={`container ${styles.navContainer}`}>
          {/* Brand Logo & Wordmark */}
          <a href="#hero" className={styles.brandLink} aria-label={`${EVENT_CONFIG.branding.name} homepage`}>
            <div className={styles.brandIcon} aria-hidden="true">
              <Footprints size={22} strokeWidth={2.4} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>{EVENT_CONFIG.branding.shortName}</span>
              <span className={styles.brandOrganizer}>
                {EVENT_CONFIG.branding.organizerName} {EVENT_CONFIG.branding.isOrganizerTentative ? '(Provisional)' : ''}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className={styles.navLinksDesktop}>
              {EVENT_CONFIG.navLinks
                .filter((link) => !link.isCta)
                .map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={styles.navLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Navigation Actions (CTA & Mobile Menu Toggle) */}
          <div className={styles.navActions}>
            <a
              href="#register"
              className={`btn btn-primary btn-sm ${styles.desktopCta}`}
              id="nav-register-cta"
            >
              <span>Register</span>
              <ArrowUpRight size={16} />
            </a>

            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`${styles.drawerBackdrop} ${isMobileOpen ? styles.drawerBackdropOpen : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile Drawer Content */}
      <aside
        id="mobile-nav-drawer"
        className={`${styles.mobileDrawer} ${isMobileOpen ? styles.mobileDrawerOpen : ''}`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className={styles.drawerHeader}>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>{EVENT_CONFIG.branding.shortName}</span>
            <span className={styles.brandOrganizer}>{EVENT_CONFIG.timing.displayDate}</span>
          </div>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={closeMobile}
            aria-label="Close Navigation"
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Mobile Links">
          <ul className={styles.mobileNavList}>
            {EVENT_CONFIG.navLinks
              .filter((link) => !link.isCta)
              .map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.mobileNavLink} onClick={closeMobile}>
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <div className={styles.mobileDrawerFooter}>
          <a
            href="#register"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={closeMobile}
          >
            <span>Register (Google Form)</span>
            <ArrowUpRight size={18} />
          </a>
          <p className={styles.mobileNotice}>
            Phase 1 Pre-registration. Free community participation. No payment required.
          </p>
        </div>
      </aside>
    </>
  );
};
