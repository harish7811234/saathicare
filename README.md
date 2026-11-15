# SaathiCare — Care That Connects Generations

> **A collaborative elderly healthcare management platform connecting elderly individuals, family members, and caretakers through medication tracking, appointments, and coordinated routines.**

[![CI](https://github.com/saathicare/saathicare/actions/workflows/ci.yml/badge.svg)](https://github.com/saathicare/saathicare/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## 1. Project Overview

SaathiCare is built around a single core philosophy:  
**Keep elderly individuals independent while making healthcare collaborative.**

Elderly healthcare is often fragmented across handwritten medication lists, messaging apps, and phone check-ins. Family members worry from afar, caretakers lack structured logs, and elderly parents feel micromanaged. 

SaathiCare replaces this friction with **one shared healthcare space** designed with the clarity of **Notion**, the health visualisations of **Apple Health**, and the reassuring warmth of **Headspace**.

---

## 2. The Problem & Our Solution

| The Traditional Fragmented Care Problem | The SaathiCare Way |
| :--- | :--- |
| Repetitive phone calls asking *"Did you take your medicine?"* | Dignified **1-click confirmation** preserves elderly independence |
| Missed doses discovered hours or days too late | **Smart escalation alerts** notify caretakers and families |
| Prescriptions lost in paper files and envelopes | Centralised daily schedule categorized by morning, lunch, and bedtime |
| Scattered appointment reminders across family group chats | Synchronised doctor visits with accompanied-by assignments |

---

## 3. Core Features

### A. 3 Connected Demo Roles
- **Elderly Mode (`Meera Patel`, 72):** Elder-first interface with large touch targets, simplified daily routine, 1-click dose confirmations, and celebratory feedback.
- **Family Mode (`Aarav Patel`, Son):** Oversight dashboard, full prescription CRUD, doctor appointment scheduling, weekly adherence analytics, and escalation alerts.
- **Caretaker Mode (`Priya Shah`, Certified Caregiver):** Daily administration assistance, morning vitals logging (BP, Sugar, Pulse, Weight), and pending task checklists.

### B. Smart Missed-Dose Workflow
- One-click **"Simulate Missed Dose"** action instantly triggers a 3-tiered escalation sequence:
  1. Follow-up reminder for Elderly user (`Meera`).
  2. In-person check alert for Caretaker (`Priya`).
  3. Escalation notification for Family guardian (`Aarav`).
  4. Automatic log entry in the chronological Care Timeline.

### C. Medication Management & Adherence
- Full CRUD operations with dosage, frequency, reminder times, purpose, and color tags.
- Data-derived 7-day adherence bar chart and dose status distribution donut chart (Recharts).

### D. Doctor Appointments & Care Circle
- Comprehensive appointment management with clinic details, prep notes, and accompanying family.
- Working simulated **6-digit invitation code workflow** (try code `582914` or generate a new code).

### E. Health Profile & Care Timeline
- Dynamic vital signs recording with historical timestamps.
- Chronological activity feed tracking every dose confirmation, appointment change, and escalation.

---

## 4. Visual Design Identity

SaathiCare harmonises three distinct design languages into one warm, accessible identity:
- **Warm Ivory Background:** `#FAF8F2`
- **Soft Charcoal Typography:** `#30352F`
- **Muted Sage Green:** `#789B7D` (Primary Accent) / `#E6F1E8` (Soft Green Surface)
- **Peach:** `#FCE8D8` (Family Accent)
- **Soft Lavender:** `#E8EAF7` (Caretaker Accent)
- **Soft Yellow:** `#F5E9B9` (Warm Highlight)
- **Border:** `#EAE9E2`

---

## 5. Technology Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v3.4 + PostCSS
- **Icons:** Lucide React
- **Data Visualisation:** Recharts v3
- **Micro-Interactions:** Canvas-Confetti
- **Testing:** Vitest + React Testing Library + Playwright
- **Persistence:** LocalStorage with Decoupled Service Repositories

---

## 6. Architecture & LocalStorage Persistence

SaathiCare uses a clean **Decoupled Repository Pattern** (`storageService`, `medicationService`, `appointmentService`, `careCircleService`, `notificationService`, `activityService`):
- All application state persists locally under the schema key `saathicare_app_data_v1`.
- Built-in event-bus listeners provide reactive UI updates across components.
- Corrupted or missing storage is safely detected and restored to pristine seed data.
- **Zero external database latency:** Built to transition seamlessly to Supabase or Firebase without frontend rewrites.

For detailed diagrams and patterns, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 7. Quick Start & Installation

### Prerequisites
- Node.js (v20.x or v22.x LTS recommended)
- npm (v10+ or v11+)

### Installation
```bash
# Clone repository
git clone https://github.com/<your-username>/saathicare.git
cd saathicare

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 8. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server |
| `npm run build` | Compiles TypeScript and builds production bundle in `dist/` |
| `npm run typecheck` | Validates TypeScript with zero build emission |
| `npm test` | Runs the automated Vitest test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run preview` | Locally previews the production build |

---

## 9. 2-Minute Demonstration Journey

Follow this guided demo path (or use the built-in **Demo Tour** bar at the top):

1. **Enter as Meera Patel (Elderly):** Click *"Launch Demo"* &rarr; Enter as Meera. Review today's morning schedule.
2. **Confirm Dose:** Click *"Mark Taken"* on morning **Metformin XR**. Watch the confetti animation and notice the adherence metric update to 2/4 doses (50%).
3. **Switch to Aarav (Family):** Use the top bar switcher. Notice the dashboard transitions to family oversight with full prescription and appointment controls.
4. **Inspect Adherence Analytics:** Navigate to the **Adherence** tab. Inspect the 7-day compliance chart and status distribution.
5. **Simulate Missed Dose:** Click **"Simulate Missed Dose"** in the top bar. Notice the amber toast alert and notification count update.
6. **Review Caretaker Escalation:** Switch to **Priya (Caretaker)**. Navigate to **Notifications** to see the urgent in-person check alert.
7. **Inspect Care Timeline:** Navigate to **Care Timeline** to see the chronological audit log of all dose confirmations and escalations.
8. **Reset Demo:** Navigate to **Settings** &rarr; Click **"Reset All Demo Data"** to restore pristine initial state.

---

## 10. Deployment (Vercel)

SaathiCare is pre-configured for instant deployment on **Vercel** with SPA routing rules defined in `vercel.json`:

```bash
# Deploy via Vercel CLI
vercel --prod
```

Or connect the repository on the [Vercel Dashboard](https://vercel.com/new). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment instructions.

---

## 11. Privacy & Healthcare Disclaimer

> [!WARNING]
> **SaathiCare is a demonstration prototype.**  
> Data is stored locally in your browser and is not synchronised between users or devices. Do not enter real medical or personal information. SaathiCare does not provide medical advice or replace professional healthcare services.

For full details, review [docs/PRIVACY.md](docs/PRIVACY.md) and [SECURITY.md](SECURITY.md).

---

## 12. Known Limitations & Future Roadmap

- **Current Prototype:** LocalStorage persistence on a single client device.
- **Phase 2 Roadmap:**
  - Supabase PostgreSQL backend with Row-Level Security (RLS).
  - WebAuthn biometric login (FaceID / Fingerprint) for elderly ease.
  - Multi-channel escalation via WhatsApp Business API and Twilio SMS.
  - Resend email digest integration for distant family members.
  - Smart pill dispenser hardware integration (BLE/WiFi).

---

## 13. License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
