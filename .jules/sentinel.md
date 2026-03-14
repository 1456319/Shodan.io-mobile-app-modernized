## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-12 - [CRITICAL] Fix Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging network alert data and user profile data directly to the console in `src/app/alerts/alerts.page.ts`, `src/app/alerts-details/alerts-details.page.ts`, and `src/app/profile/profile.page.ts`.
**Learning:** Similar to the previous incident, developers left debugging `console.log` statements in the code, which leaked sensitive Shodan data.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use linting rules (like `no-console`) to prevent `console.log` from making it into production code.
