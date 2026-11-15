# Changelog

All notable changes to the **SaathiCare** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-15

### Added
- **Interactive Multi-Role Architecture:**
  - **Elderly Mode (`Meera Patel`):** Accessible large touch targets, today's schedule, 1-click dose confirmations, celebratory confetti.
  - **Family Mode (`Aarav Patel`):** Complete prescription CRUD, doctor appointment scheduling, weekly adherence analytics, and escalation monitoring.
  - **Caretaker Mode (`Priya Shah`):** Dose confirmation assistance, vital signs logging, and pending tasks overview.
- **Smart Missed-Dose Simulation:**
  - One-click trigger for automated escalation workflow (Elderly reminder &rarr; Caretaker alert &rarr; Family escalation &rarr; Activity timeline log).
- **Medication Management & Tracking:**
  - Full CRUD operations with color tags, reminder times, and instructions.
  - Categorized schedule (Morning, Afternoon, Evening, Night).
  - 7-day adherence trend bar chart and distribution breakdown using Recharts.
- **Doctor Appointments:**
  - Upcoming and past visit scheduling, accompanied-by assignments, contact info, and clinic notes.
- **Collaborative Care Circle:**
  - Member management and simulated 6-digit access code invitation workflow.
- **Elderly Health Profile:**
  - Dynamic vitals editor (BP, Sugar, Pulse, Weight), chronic conditions, and drug allergies.
- **Notification Centre:**
  - Categorized feed with read/unread state toggling and priority badges.
- **Care Activity Timeline:**
  - Chronological activity feed logging all actions with verified actor signatures.
- **LocalStorage Persistence Layer:**
  - Decoupled storage repository pattern with versioned schema (`saathicare_app_data_v1`) and reactive event-bus listener.
- **Developer & DevOps Suite:**
  - Vitest automated test suite with 17 unit and component tests.
  - GitHub Actions CI workflow for Node.js 20.x & 22.x.
  - Dependabot automated dependency maintenance.
  - Vercel single-page application deployment configuration (`vercel.json`).
  - Comprehensive documentation suite under `docs/`.
