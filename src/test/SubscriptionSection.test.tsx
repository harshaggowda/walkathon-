import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubscriptionSection } from '../features/subscription/SubscriptionSection';

describe('SubscriptionSection Component', () => {
  it('displays error if submitted with empty or invalid email', () => {
    render(<SubscriptionSection />);
    const submitBtn = screen.getByRole('button', { name: /Notify Me/i });

    fireEvent.click(submitBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(/Please provide a valid email address/i);
  });

  it('displays error if consent checkbox is unchecked', () => {
    render(<SubscriptionSection />);
    const emailInput = screen.getByRole('textbox', { name: /Email address for event alerts/i });
    const submitBtn = screen.getByRole('button', { name: /Notify Me/i });

    fireEvent.change(emailInput, { target: { value: 'citizen@example.com' } });
    fireEvent.click(submitBtn);

    expect(screen.getByRole('alert')).toHaveTextContent(/Please check the consent box/i);
  });

  it('honestly displays non-production simulation state without false claims', async () => {
    render(<SubscriptionSection />);
    const emailInput = screen.getByRole('textbox', { name: /Email address for event alerts/i });
    const consentCheckbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: /Notify Me/i });

    fireEvent.change(emailInput, { target: { value: 'walker@example.com' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Validation Successful \(Demo Presentation State\)/i)
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    expect(screen.getByText(/There is no backend connected in Phase 1/i)).toBeInTheDocument();
  });
});
