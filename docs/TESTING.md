# SaathiCare — Testing Strategy & Verification Guide

SaathiCare includes a multi-layer testing suite combining **Vitest unit tests**, **React Testing Library component tests**, and **Playwright end-to-end browser automation**.

---

## 1. Running Tests Locally

### Unit & Component Tests (Vitest)
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### TypeScript Validation
```bash
npm run typecheck
```

### Production Build Validation
```bash
npm run build
```

---

## 2. Test Coverage Summary

- **`src/services/__tests__/services.test.ts` (15 tests):**
  - **Storage Service:** Initial seed data population, corrupted LocalStorage fallback, state reset.
  - **Medication Service:** Prescription creation, scheduled dose generation, 1-click confirmation as taken, dose undo without duplication, medication deletion with cascading dose cleanup.
  - **Appointment Service:** Appointment scheduling, upcoming vs past filtering, cancellation, permanent deletion.
  - **Care Circle Service:** 6-digit invitation code generation, code consumption upon joining, prevention of removing primary profile owners.
  - **Notification Service:** Priority-based alert creation, read/unread state toggling, multi-tiered missed dose escalation sequence with activity logging.
- **`src/components/__tests__/MedicationDoseCard.test.tsx` (2 tests):**
  - Card rendering, dosage labels, touch action buttons, celebratory taken badge, and undo action.

---

## 3. End-to-End Browser Automation (Playwright)

End-to-end testing verifies real user interactions:
1. Navigation across all 9 application routes.
2. 1-click dose confirmation with canvas-confetti celebration.
3. Live missed-dose simulation and notification feed generation.
4. Care Circle 6-digit access code invitation workflow.
5. 4-tier responsive viewport testing (Desktop, Laptop, Tablet, Mobile) with 0px horizontal overflow.
