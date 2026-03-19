## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2024-03-20 - [MEDIUM] Fix PII/Data Leak in Console Logs
**Vulnerability:** The application was indiscriminately logging user profile data (e.g., `res`, `this.profile.created`) and network alert configurations (e.g., `alerts`, `value`, `result`) directly to the console in `src/app/profile/profile.page.ts`, `src/app/alerts/alerts.page.ts`, and `src/app/alerts-details/alerts-details.page.ts`.
**Learning:** This is a recurring pattern in this codebase. Developers use `console.log` for quick debugging of API responses without considering the privacy implications of leaving them in production. Even seemingly innocuous data can be considered PII or provide attackers with insights into the system's structure.
**Prevention:** Implement automated linting rules (e.g., `no-console` in ESLint/TSLint) to flag console statements during development or CI/CD pipelines, forcing developers to explicitly justify or remove them.
