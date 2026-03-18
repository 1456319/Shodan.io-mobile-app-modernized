## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2024-03-20 - [CRITICAL] Prevent Information Leakage in Console Logs
**Vulnerability:** Found multiple instances where sensitive API data (like Shodan user profile details) and unhandled bootstrap error exceptions (which could leak stack traces or config details) were being logged using `console.log`.
**Learning:** Developers frequently use `console.log` for debugging responses and catching initial promise rejections. In production, this can unintentionally expose sensitive information to local storage, crash reporting tools, or physical observers.
**Prevention:** Avoid logging complete response objects (`res`) or generic error objects (`err`). Always use specific error messages or dedicated logging services that automatically scrub sensitive information.

## 2024-03-20 - [MEDIUM] CI Pipeline using outdated Github Actions
**Vulnerability:** GitHub Actions workflows were using deprecated `v1` actions (`actions/checkout@v1`, `actions/cache@v1`, `actions/upload-artifact@v1`) which were causing CI pipeline failures and exposing the repo to potential supply chain vulnerabilities (e.g. lack of nodejs 20 runtime support in the runner).
**Learning:** CI/CD components must be maintained just like application dependencies. Deprecated versions of actions frequently stop working because of underlying changes in the runner environment, or have security issues that don't get patched.
**Prevention:** Keep Github actions up to date (e.g., v4) to ensure they receive critical security patches and maintain compatibility with modern runners. Automate dependency updates for `.github/workflows/` using tools like Dependabot.
