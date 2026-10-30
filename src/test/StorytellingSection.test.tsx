import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StorytellingSection } from '../features/storytelling/StorytellingSection';
import { JOURNEY_CHECKPOINTS } from '../config/journey.config';

describe('StorytellingSection (Interactive Journey Road)', () => {
  it('renders the initial Checkpoint 01 headline and phase badge', () => {
    render(<StorytellingSection />);
    expect(
      screen.getByText(JOURNEY_CHECKPOINTS[0].headline)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(JOURNEY_CHECKPOINTS[0].phase, 'i')).length
    ).toBeGreaterThan(0);
  });

  it('renders roadmap controls for all 4 checkpoints', () => {
    render(<StorytellingSection />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(4);
    expect(tabs[0]).toHaveTextContent(/ONE STEP/i);
    expect(tabs[1]).toHaveTextContent(/TOGETHER/i);
    expect(tabs[2]).toHaveTextContent(/MOVEMENT/i);
    expect(tabs[3]).toHaveTextContent(/THE DESTINATION/i);
  });

  it('switches active checkpoint panel when tabs are clicked', () => {
    render(<StorytellingSection />);
    // Click tab for Checkpoint 02 (TOGETHER)
    const tab2 = screen.getByRole('tab', { name: /02 • TOGETHER/i });
    fireEvent.click(tab2);

    expect(screen.getByText(JOURNEY_CHECKPOINTS[1].headline)).toBeInTheDocument();
    expect(screen.getByText(JOURNEY_CHECKPOINTS[1].lead)).toBeInTheDocument();
  });

  it('renders registration CTA link pointing to #register when destination checkpoint is selected', () => {
    render(<StorytellingSection />);
    // Click tab for Checkpoint 04 (THE DESTINATION)
    const tab4 = screen.getByRole('tab', { name: /04 • THE DESTINATION/i });
    fireEvent.click(tab4);

    expect(screen.getByText(JOURNEY_CHECKPOINTS[3].headline)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Register \(Google Form\)/i });
    expect(cta).toHaveAttribute('href', '#register');
  });
});
