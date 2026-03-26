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

## 2026-03-26 - [HIGH] Fix Missing URI Encoding and Parameter Usage in API Request
**Vulnerability:** The `getHostsCount` method in `src/app/api.service.ts` was failing to include and encode user-provided `query` and `facets` parameters in the API request URL. This resulted in a functional failure and a potential risk of URI-based injection if the parameters were manually added without encoding.
**Learning:** Even when a method's primary purpose is returning metadata (like counts), it must still correctly process and encode all relevant user inputs to ensure both security and functionality. Fire-and-forget subscriptions can also mask these issues by swallowing errors and responses.
**Prevention:** Always use `encodeURIComponent()` for all user-provided strings appended to a URL. Use automated tests to verify that constructed URLs match expected formats, especially for security-sensitive API calls. Avoid "fire-and-forget" patterns that hide implementation errors.
