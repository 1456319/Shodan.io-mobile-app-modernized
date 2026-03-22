## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-22 - [HIGH] Fix sensitive data leak in console logs
**Vulnerability:** Several components leaked sensitive data such as network alerts, search queries, profile results, and API keys via `console.log`.
**Learning:** Developers use `console.log` for debugging but often forget to remove them before deploying to production, which exposes sensitive application state and user data to the browser console.
**Prevention:** Avoid using `console.log` for sensitive data entirely or use a logger that can be disabled in production. Implement linting rules that ban `console.log` statements in production code.
