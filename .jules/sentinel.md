## 2026-08-13 - [MEDIUM] Sensitive Information Exposure in Input
**Vulnerability:** API key input was visible in plaintext, making it vulnerable to shoulder-surfing.
**Learning:** Sensitive inputs such as API keys and passwords should always use masking features like `secureTextEntry` in React Native.
**Prevention:** Ensure `secureTextEntry` is set for all `TextInput` components handling credentials or secrets.
