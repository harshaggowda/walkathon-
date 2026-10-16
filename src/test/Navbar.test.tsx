import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../components/navigation/Navbar';
import { EVENT_CONFIG } from '../config/event.config';

describe('Navbar Component', () => {
  it('renders brand name and temporary organizer indicator', () => {
    render(<Navbar />);
    expect(screen.getAllByText(EVENT_CONFIG.branding.shortName).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/RSS Prida Bharati/i)).toBeInTheDocument();
  });

  it('renders all main navigation links pointing to valid section anchors', () => {
    render(<Navbar />);
    EVENT_CONFIG.navLinks
      .filter((link) => !link.isCta)
      .forEach((link) => {
        const matches = screen.getAllByRole('link', { name: link.label });
        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0]).toHaveAttribute('href', link.href);
      });
  });

  it('toggles mobile menu drawer on button click', () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole('button', { name: /Open Navigation Menu/i });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // Drawer should have open class or style
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass(/mobileDrawerOpen/);
  });
});
