## 2026-03-12 - [CRITICAL] Fix API Key and Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging HTTP error responses (`err`), full request URLs containing the API key (`tmpUrl`), and sensitive user profile data (`alert`, `value`) directly to the console in `src/app/api.service.ts` and `src/app/ask-apikey/ask-apikey.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of credentials and internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information like API keys before writing to logs or error tracking systems.

## 2026-03-23 - [HIGH] Fix URL Parameter Pollution and Path Traversal
**Vulnerability:** The application was directly concatenating user-provided inputs (`ip`, `query`, `id`) into HTTP request URLs in `src/app/api.service.ts` without URL encoding. This created a risk of HTTP Parameter Pollution (HPP) and Server-Side Path Traversal on the API endpoints, as a user could inject `&`, `=`, or `../` into their inputs to manipulate the API request.
**Learning:** Developers often forget to encode user inputs when constructing URLs, especially when building URLs manually using string concatenation instead of using built-in URL builders or HTTP client parameter options.
**Prevention:** Always use `encodeURIComponent()` when appending user input to URL paths or query parameters. Alternatively, use modern HTTP client features (like Angular's `HttpParams`) that automatically handle URL encoding.

## 2026-03-24 - [CRITICAL] Fix Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging sensitive user profile data to the browser console (`console.log(res);` and `console.log(this.profile.created);`) in `src/app/profile/profile.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information before writing to logs or error tracking systems.

## 2026-03-26 - [CRITICAL] Fix Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging sensitive user bookmark keys (`keyBookmark`) and the entire `bookmarks` object to the console in `src/app/storage.service.ts`.
**Learning:** Even when debugging specific features like bookmarking, logging entire data structures or unique keys can lead to significant information leakage of user-specific data.
**Prevention:** Strictly enforce a "no console.log" policy for production code, especially when dealing with data retrieved from storage services. Use safe logging abstractions that sanitize data.
## 2026-03-27 - [CRITICAL] Fix Sensitive Data Leak in Console Logs
**Vulnerability:** The application was logging sensitive network alerts and alert creation responses to the browser console (`console.log(alerts);` and `console.log(value);`) in `src/app/alerts/alerts.page.ts`.
**Learning:** Developers often use `console.log` for debugging during development and forget to remove them before production, leading to unintentional information leakage of internal application state.
**Prevention:** Establish a strict policy against logging sensitive data or generic error objects. Use a dedicated logging service that automatically strips or masks sensitive information before writing to logs or error tracking systems.

## 2026-05-29 - [CRITICAL] Fix Pervasive Sensitive Data Leak in Console Logs
**Vulnerability:** The application was extensively logging sensitive user data, including search history, bookmarks, search queries, query results, host details, and network alerts, directly to the browser console across multiple components (`history.page.ts`, `my-searches.page.ts`, `alerts-details.page.ts`, `home.page.ts`, `queries.page.ts`, `host-results.page.ts`, `search-results.page.ts`).
**Learning:** The pervasive use of `console.log` for debugging across an entire application can lead to massive data leakage of a user's activity and internal application state if not systematically removed before production.
**Prevention:** Implement comprehensive static analysis (like ESLint's `no-console` rule) in the CI pipeline to automatically detect and prevent any `console.log` statements from being merged into production branches.
