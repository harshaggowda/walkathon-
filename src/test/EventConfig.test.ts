import { describe, it, expect } from 'vitest';
import { EVENT_CONFIG } from '../config/event.config';

describe('Event Configuration Integrity', () => {
  it('should have valid branding configuration with temporary placeholders', () => {
    expect(EVENT_CONFIG.branding.name).toBeDefined();
    expect(EVENT_CONFIG.branding.headline).toBe('EVERY STEP. ONE PURPOSE.');
    expect(EVENT_CONFIG.branding.supportingLine).toBe('A movement begins with you.');
    expect(EVENT_CONFIG.branding.isOrganizerTentative).toBe(true);
  });

  it('should specify planned event timeline in January 2027', () => {
    expect(EVENT_CONFIG.timing.displayDate).toContain('January 2027');
    expect(EVENT_CONFIG.timing.isDateFinalized).toBe(false);
  });

  it('should specify planned scale of 20,000 registrations and 10,000 participants', () => {
    expect(EVENT_CONFIG.scale.targetRegistrations).toBe(20000);
    expect(EVENT_CONFIG.scale.expectedParticipants).toBe(10000);
    expect(EVENT_CONFIG.scale.distanceCategories.length).toBeGreaterThanOrEqual(3);
  });

  it('should have Google Forms registration configured as non-monetized', () => {
    expect(EVENT_CONFIG.registration.mode).toBe('google-forms-link');
    expect(EVENT_CONFIG.registration.googleFormsUrl).toContain('docs.google.com/forms');
    expect(EVENT_CONFIG.registration.isUrlPlaceholder).toBe(true);
  });

  it('should contain well-structured announcements and FAQs', () => {
    expect(EVENT_CONFIG.announcements.length).toBeGreaterThan(0);
    expect(EVENT_CONFIG.faqs.length).toBeGreaterThan(0);
    expect(EVENT_CONFIG.navLinks.length).toBeGreaterThanOrEqual(5);
  });
});
