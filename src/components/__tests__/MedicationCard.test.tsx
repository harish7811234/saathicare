import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MedicationCard } from '../medications/MedicationCard';
import { AppProvider } from '../../context/AppContext';
import { Medication } from '../../types';

describe('MedicationCard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const testMed: Medication = {
    id: 'test-med-1',
    name: 'Amlodipine Besylate',
    dosage: '5 mg',
    frequency: 'Once daily (Morning)',
    reminderTimes: ['08:00 AM'],
    instructions: 'Take with a glass of water',
    startDate: '2026-01-01',
    purpose: 'Blood Pressure Control',
    timeOfDay: 'morning',
    status: 'active',
    prescribedBy: 'Dr. Rajesh Sharma',
    colorTag: 'sage',
    remainingPills: 9,
    totalPills: 30,
    precautions: ['Monitor for ankle swelling'],
  };

  it('renders medication name, dosage, and indication', () => {
    render(
      <AppProvider>
        <MedicationCard medication={testMed} onEdit={() => {}} />
      </AppProvider>
    );

    expect(screen.getByText('Amlodipine Besylate')).toBeInTheDocument();
    expect(screen.getByText(/5 mg • Once daily/)).toBeInTheDocument();
    expect(screen.getByText(/Blood Pressure Control/)).toBeInTheDocument();
  });

  it('displays low supply indicator when remaining pills are 10 or fewer', () => {
    render(
      <AppProvider>
        <MedicationCard medication={testMed} onEdit={() => {}} />
      </AppProvider>
    );

    expect(screen.getByText(/9 \/ 30 pills/)).toBeInTheDocument();
    expect(screen.getByText(/Low Supply/)).toBeInTheDocument();
  });
});
