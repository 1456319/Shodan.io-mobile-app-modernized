## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2024-05-20 - [Avoid logging sensitive tokens and states]
**Vulnerability:** A `console.log` statement in `src/app/login.guard.ts` exposed the plain text `apiKey` directly to the console. Bookmark values in `storage.service.ts` were also being logged.
**Learning:** During debugging and development, engineers often leave `console.log` statements in places that manage state or read sensitive items directly from storage. When left in production code, this leaks sensitive information such as API tokens to users or physical adversaries.
**Prevention:** Avoid debugging by logging raw secrets. Ensure `console.log` usage is routinely scrubbed or linted out in production-ready branches, especially in Guard components and state handlers dealing with authentication tokens.
