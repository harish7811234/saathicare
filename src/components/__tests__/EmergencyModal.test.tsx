import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmergencyModal } from '../layout/EmergencyModal';
import { AppProvider } from '../../context/AppContext';

describe('EmergencyModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AppProvider>
        <EmergencyModal isOpen={false} onClose={() => {}} />
      </AppProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders emergency assistance modal with primary contacts and SOS button when open', () => {
    render(
      <AppProvider>
        <EmergencyModal isOpen={true} onClose={() => {}} />
      </AppProvider>
    );

    expect(screen.getByText('Emergency Assistance')).toBeInTheDocument();
    expect(screen.getByText('Broadcast SOS to Care Circle')).toBeInTheDocument();
    expect(screen.getByText(/Current Registered Location/)).toBeInTheDocument();
    expect(screen.getByText(/National Ambulance & Medical SOS/)).toBeInTheDocument();
  });

  it('triggers emergency broadcast when SOS button is clicked', () => {
    render(
      <AppProvider>
        <EmergencyModal isOpen={true} onClose={() => {}} />
      </AppProvider>
    );

    const sosButton = screen.getByText('Broadcast SOS to Care Circle');
    fireEvent.click(sosButton);

    expect(screen.getByText('Care Circle Alerted Successfully!')).toBeInTheDocument();
  });
});
