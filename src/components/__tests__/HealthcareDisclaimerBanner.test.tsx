import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HealthcareDisclaimerBanner } from '../common/HealthcareDisclaimerBanner';

describe('HealthcareDisclaimerBanner Component', () => {
  it('renders the prototype disclaimer text clearly', () => {
    render(<HealthcareDisclaimerBanner />);

    expect(screen.getByText(/Demonstration Prototype:/)).toBeInTheDocument();
    expect(screen.getByText(/SaathiCare stores data locally in your browser/)).toBeInTheDocument();
  });

  it('hides the banner when the dismiss button is clicked', () => {
    render(<HealthcareDisclaimerBanner />);

    const dismissBtn = screen.getByTitle('Dismiss notice');
    fireEvent.click(dismissBtn);

    expect(screen.queryByText(/Demonstration Prototype:/)).not.toBeInTheDocument();
  });
});
