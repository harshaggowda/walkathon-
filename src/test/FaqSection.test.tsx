import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaqSection } from '../features/faq/FaqSection';
import { EVENT_CONFIG } from '../config/event.config';

describe('FaqSection Component', () => {
  it('renders all FAQ questions from configuration', () => {
    render(<FaqSection />);
    EVENT_CONFIG.faqs.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });

  it('toggles FAQ accordion expansion when clicked', () => {
    render(<FaqSection />);
    const firstFaq = EVENT_CONFIG.faqs[0];
    const headerBtn = screen.getByRole('button', { name: new RegExp(firstFaq.question, 'i') });

    // Initial state is open for first item in component defaults
    expect(headerBtn).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    fireEvent.click(headerBtn);
    expect(headerBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to expand again
    fireEvent.click(headerBtn);
    expect(headerBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
