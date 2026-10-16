import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RegistrationSection } from '../features/registration/RegistrationSection';
import { EVENT_CONFIG } from '../config/event.config';

describe('RegistrationSection Component', () => {
  it('renders Google Forms registration link with correct URL and security attributes', () => {
    render(<RegistrationSection />);
    const linkBtn = screen.getByRole('link', { name: /Proceed to Google Form/i });
    expect(linkBtn).toHaveAttribute('href', EVENT_CONFIG.registration.googleFormsUrl);
    expect(linkBtn).toHaveAttribute('target', '_blank');
    expect(linkBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays non-monetized and free participation notice', () => {
    render(<RegistrationSection />);
    expect(screen.getByText(/100% free with no registration fees/i)).toBeInTheDocument();
    expect(screen.getByText(/No Payment Processing/i)).toBeInTheDocument();
  });

  it('allows toggling the simulated embed preview for organizers', () => {
    render(<RegistrationSection />);
    const toggleBtn = screen.getByRole('button', { name: /Preview Embedded Form Layout/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Google Forms iFrame Sandbox/i)).toBeInTheDocument();
  });
});
