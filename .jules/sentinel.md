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

## 2024-03-20 - [MEDIUM] Third-Party Typings Blocking Compilation
**Vulnerability:** A third-party library (`@ionic/storage`) introduced TypeScript definition errors ("An accessor cannot be declared in an ambient context") causing CI builds to fail.
**Learning:** External dependencies can break builds due to strict type checking rules on ambient context declarations, even if the application code itself is secure and correct. This introduces a subtle supply chain maintenance risk.
**Prevention:** Configure the compiler to skip type checking of declaration files (`"skipLibCheck": true` in `tsconfig.json`). This ensures the app compiles while acknowledging we only rely on the external library's types structurally, preventing extraneous typing strictness from breaking our CI.

## 2024-03-20 - [MEDIUM] Runner environment incompatibility with older SDKs
**Vulnerability:** Github actions using `ubuntu-latest` automatically upgraded the default Gradle version to one requiring Java 17+, breaking the CI build pipeline because our Android build relies on an older version of Java (JDK 8).
**Learning:** Automatically relying on `ubuntu-latest` or `windows-latest` for legacy projects often causes unexpected downtime because underlying toolchains (like gradle, node, xcode) get aggressively updated, potentially exposing a project to unverified or incompatible tools.
**Prevention:** Pin the runner OS to a specific, compatible LTS version (e.g., `ubuntu-20.04`) and explicitly define toolchain dependencies to maintain predictable builds and reduce supply chain instability.
