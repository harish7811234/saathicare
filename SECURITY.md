# Security Policy

## Reporting Security Issues

The SaathiCare team takes privacy and security seriously. If you discover a security vulnerability, please do not disclose it publicly in issues or discussions.

Instead, please report vulnerabilities by opening a private security advisory on GitHub or emailing security@saathicare.demo.

We will acknowledge receipt within 48 hours and work with you to remediate the vulnerability.

---

## Prototype Scope & Data Handling Disclaimers

> [!IMPORTANT]
> **Demonstration Architecture Notice:**
> - SaathiCare is currently a client-side demonstration prototype.
> - All application state is stored locally within browser `LocalStorage` under the key `saathicare_app_data_v1`.
> - The application does not communicate with any external backend database, cloud storage, or third-party tracking services.
> - Simulated user roles (Meera, Aarav, Priya) and 6-digit Care Circle access codes are designed for demonstrative usability, not cryptographic production security.
> - **Do not enter real personal health information (PHI), passwords, or credentials into the prototype.**

---

## Development Security Best Practices

When contributing to this repository:
1. **Never commit secrets:** Ensure `.env`, API keys, tokens, or credentials are never staged or pushed.
2. **Minimal GitHub Actions permissions:** All workflows explicitly declare `permissions: contents: read`.
3. **Dependencies:** Regular audits via `npm audit` and Dependabot automated updates.
4. **Input sanitization:** Prevent XSS by using React's native JSX escaping and avoiding `dangerouslySetInnerHTML`.
