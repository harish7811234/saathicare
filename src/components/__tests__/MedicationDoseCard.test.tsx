import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MedicationDoseCard } from '../medications/MedicationDoseCard';
import { AppProvider } from '../../context/AppContext';
import { MedicationDose } from '../../types';

describe('MedicationDoseCard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleDose: MedicationDose = {
    id: 'test-dose-1',
    medicationId: 'med-01',
    medicationName: 'Telmisartan BP',
    dosage: '40 mg',
    instructions: 'Take 30 mins after breakfast',
    timeOfDay: 'morning',
    scheduledDate: '2026-11-15',
    scheduledTime: '08:30 AM',
    status: 'upcoming',
    colorTag: 'sage',
  };

  it('renders medication name, dosage and scheduled time correctly', () => {
    render(
      <AppProvider>
        <MedicationDoseCard dose={sampleDose} isElderlyMode={false} />
      </AppProvider>
    );

    expect(screen.getByText('Telmisartan BP')).toBeInTheDocument();
    expect(screen.getByText('40 mg')).toBeInTheDocument();
    expect(screen.getByText('08:30 AM')).toBeInTheDocument();
    expect(screen.getByText('Mark Taken')).toBeInTheDocument();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('displays taken badge and undo button when dose status is taken', () => {
    const takenDose: MedicationDose = {
      ...sampleDose,
      status: 'taken',
      actionTimestamp: '08:35 AM',
      actionBy: 'Meera Patel',
    };

    render(
      <AppProvider>
        <MedicationDoseCard dose={takenDose} isElderlyMode={false} />
      </AppProvider>
    );

    expect(screen.getAllByText(/Taken/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Confirmed by Meera Patel/)).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });
});
