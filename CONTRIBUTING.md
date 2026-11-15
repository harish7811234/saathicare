# Contributing to SaathiCare

Thank you for your interest in contributing to **SaathiCare — Care That Connects Generations**! We welcome bug fixes, documentation improvements, and thoughtful feature contributions.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/saathicare.git
   cd saathicare
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the local development server:**
   ```bash
   npm run dev
   ```

---

## Development Guidelines

- **Code Quality:** Ensure all code adheres to TypeScript typing standards.
- **Visual Design Identity:** Preserve the established warm healthcare palette:
  - Warm Ivory (`#FAF8F2`)
  - Soft Charcoal (`#30352F`)
  - Sage Green (`#789B7D` / `#E6F1E8`)
  - Peach (`#FCE8D8`)
  - Soft Lavender (`#E8EAF7`)
  - Soft Yellow (`#F5E9B9`)
- **Accessibility:** Ensure high contrast, readable typography, and accessible touch targets.

---

## Testing & Quality Checks

Before submitting a Pull Request, run the full validation suite:

```bash
# 1. Typecheck
npm run typecheck

# 2. Automated Unit & Component Tests
npm test

# 3. Production Build
npm run build
```

All checks must pass with zero errors.

---

## Submitting Pull Requests

1. Create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit your changes with clear, descriptive commit messages.
3. Push to your branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request referencing any related issues.
