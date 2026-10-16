import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnnouncementsSection } from '../features/announcements/AnnouncementsSection';
import { EVENT_CONFIG } from '../config/event.config';

describe('AnnouncementsSection Component', () => {
  it('renders all sample announcements initially', () => {
    render(<AnnouncementsSection />);
    EVENT_CONFIG.announcements.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('filters announcements by category tab', () => {
    render(<AnnouncementsSection />);
    const healthTab = screen.getByRole('tab', { name: 'Health & Safety' });
    fireEvent.click(healthTab);

    const healthItems = EVENT_CONFIG.announcements.filter((a) => a.category === 'Health & Safety');
    healthItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('opens and closes the announcement detail modal', () => {
    render(<AnnouncementsSection />);
    const readBtns = screen.getAllByRole('button', { name: /Read Full Notice/i });
    fireEvent.click(readBtns[0]);

    // Modal should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
