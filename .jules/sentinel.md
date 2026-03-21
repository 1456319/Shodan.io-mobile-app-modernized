## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2024-05-24 - Do not use `console.log` for debugging responses
**Vulnerability:** Extensive use of `console.log()` outputs containing full API responses, exposing highly sensitive data (profile information, API keys info, credit limits, network alerts IP configurations). Generic error tracking in bootstrap `catch(err => console.log(err))` exposes internal component stack traces and application structural details.
**Learning:** Legacy development often relies on `console.log` for easy debugging. However, mobile apps executing in users' local environments can be hooked by debuggers, potentially capturing these stdout logs leading to severe information exposure.
**Prevention:** Remove debug logs before finalizing production-ready components. Always log errors descriptively and abstractly using `console.error` rather than leaking original verbose JavaScript generic error objects. Use specialized loggers matching appropriate deployment environments.
