## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-12 - [CRITICAL] Widespread Info Leakage Through Console Logs in Components
**Vulnerability:** Found multiple instances where sensitive user profile information, network alert payloads, and API keys were logged to the console using `console.log` in various page components and route guards (e.g. `login.guard.ts`, `profile.page.ts`, `alerts.page.ts`).
**Learning:** The development pattern of using `console.log` to inspect objects during development is widespread across this codebase and consistently results in sensitive data leaks into the browser console. This practice exposes API keys and network alert data directly to anyone viewing the developer tools or potentially to third-party scripts.
**Prevention:** Implement static analysis tools (like ESLint rules: `no-console`) to automatically block the usage of `console.log` in the application source, enforcing the use of proper UI alerts or a structured, secure logging mechanism.
