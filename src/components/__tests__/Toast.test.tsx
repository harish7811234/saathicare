import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toast } from '../layout/Toast';
import { AppProvider } from '../../context/AppContext';

describe('Toast Component', () => {
  it('renders nothing when there is no active toast', () => {
    const { container } = render(
      <AppProvider>
        <Toast />
      </AppProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
