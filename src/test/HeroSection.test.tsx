import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from '../features/hero/HeroSection';
import { EVENT_CONFIG } from '../config/event.config';

describe('HeroSection Component', () => {
  it('renders the configured primary headline and supporting line', () => {
    render(<HeroSection />);
    expect(screen.getByText(EVENT_CONFIG.branding.headline)).toBeInTheDocument();
    expect(screen.getByText(EVENT_CONFIG.branding.supportingLine)).toBeInTheDocument();
  });

  it('renders primary CTA linking to registration section', () => {
    render(<HeroSection />);
    const cta = screen.getByRole('link', { name: /Register/i });
    expect(cta).toHaveAttribute('href', '#register');
  });

  it('renders scale indicators (registration target and expected walkers)', () => {
    render(<HeroSection />);
    expect(screen.getByText(/20,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(EVENT_CONFIG.timing.displayDate)).toBeInTheDocument();
  });
});
