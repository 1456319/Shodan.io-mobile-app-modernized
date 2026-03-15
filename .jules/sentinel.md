## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-12 - [CRITICAL] Fix Parameter Injection in API Queries
**Vulnerability:** The `src/app/api.service.ts` directly concatenated the `query` argument into HTTP URLs without sanitization. In addition, `getHostsCount` completely ignored the user's `query` input.
**Learning:** Forgetting to sanitize or encode parameters can allow users to inject extra URL query parameters by passing strings with `&` and `=`.
**Prevention:** Always use `encodeURIComponent` when dynamically adding user strings to query string parameters.
