import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import styles from './SubscriptionSection.module.css';

export const SubscriptionSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address (e.g., walker@example.com).');
      return;
    }

    if (!consent) {
      setError('Please check the consent box to receive event updates.');
      return;
    }

    // Honest Phase 1 Demo Simulation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDemoSubmitted(email.trim());
    }, 600);
  };

  const handleReset = () => {
    setEmail('');
    setConsent(false);
    setError(null);
    setDemoSubmitted(null);
  };

  return (
    <section
      id="subscribe"
      className={styles.subscriptionWrapper}
      aria-label="Email Updates Subscription"
    >
      <div className="container">
        <div className={styles.subscribeCard}>
          <div className={styles.subscribeHeader}>
            <h2 className={styles.subscribeTitle}>
              Receive Official Launch Alerts
            </h2>
            <p className={styles.subscribeLead}>
              Be the first to receive notifications when final date permits, route maps, and volunteer registrations are officially ratified.
            </p>
          </div>

          {!demoSubmitted ? (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  id="subscriber-email"
                  className={styles.emailInput}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address for event alerts"
                  aria-required="true"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  id="subscriber-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      <span>Notify Me</span>
                    </>
                  )}
                </button>
              </div>

              {/* Consent Checkbox */}
              <label className={styles.consentContainer}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-required="true"
                />
                <span>
                  I consent to receive occasional email notifications regarding Walkathon 2027 logistics. You may unsubscribe at any time.
                </span>
              </label>

              {/* Accessible Error Banner */}
              {error && (
                <div className={styles.errorMessage} role="alert">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}
            </form>
          ) : (
            /* Honest Non-Production Demo State */
            <div className={styles.demoResultBox} role="status">
              <div className={styles.demoResultHeader}>
                <CheckCircle2 size={20} color="var(--accent-gold)" />
                <span>Validation Successful (Demo Presentation State)</span>
              </div>

              <p className={styles.demoResultText}>
                <strong>Integrity Notice:</strong> There is no backend connected in Phase 1. As per architecture standards, your email (<code>{demoSubmitted}</code>) has <strong>not</strong> been saved to any database or local storage, and no transmission has occurred.
              </p>

              <div className={styles.demoApiNote}>
                <strong>Phase 2 API Contract:</strong> Ready for <code>POST /api/v1/subscribers</code> with payload <code>&#123; email: "{demoSubmitted}", consented: true &#125;</code>.
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} />
                  <span>Test Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
