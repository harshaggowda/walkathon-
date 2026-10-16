import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './FaqSection.module.css';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className={styles.faqWrapper} aria-label="Frequently Asked Questions">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <HelpCircle size={14} />
            <span>Questions & Guidance</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-lead">
            Essential queries regarding Phase 1 pre-registration, distance categories, safety protocols, and event-day logistics.
          </p>
        </div>

        {/* Accordion List */}
        <div className={styles.accordionList}>
          {EVENT_CONFIG.faqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const contentId = `faq-content-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}
              >
                <button
                  type="button"
                  id={headerId}
                  className={styles.accordionHeader}
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className={styles.headerText}>
                    <span className={styles.categoryPill}>{faq.category}</span>
                    {faq.question}
                  </span>
                  <span
                    className={`${styles.iconWrapper} ${isOpen ? styles.iconWrapperRotated : ''}`}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className={styles.accordionContent}
                  >
                    <p>{faq.answer}</p>
                    {faq.isTentative && (
                      <span className={styles.tentativeNote}>
                        * Provisional answer: Subject to organizer ratification closer to event date.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
