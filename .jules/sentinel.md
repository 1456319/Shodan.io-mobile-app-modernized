## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-19 - [LOW] Fix Data Exposure via Console Logging (Host Details)
**Vulnerability:** The application was logging the full response from Shodan's `getHostDetails` API to the console in `src/app/host-results/host-results.page.ts`. This response contains detailed information about a host's services, ports, and potential vulnerabilities, which should not be exposed in client-side logs.
**Learning:** Even if data is intended for display in the UI, logging the entire raw API response to the console can expose more information than intended and create a larger attack surface or aid in reconnaissance.
**Prevention:** Remove all `console.log` statements before deploying to production. Use a formal logging framework with environment-based level filtering (e.g., only log to console in development).
