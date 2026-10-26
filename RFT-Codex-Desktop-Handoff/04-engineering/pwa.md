# PWA architecture and behavior

- One responsive Next.js web app for desktop, tablet and mobile. Use valid manifest, name "Ringgit Finance Tracker", short name "RFT", app icons (including maskable if feasible), theme, display standalone and secure HTTPS.
- Source RFT brand icon should come from verified `assets/`, with production sizes/derivatives; don't crop arbitrarily without review.
- Installation instructions are platform-specific: iOS Safari Add to Home Screen differs from Android-supported browser prompts. Do not promise native App Store/Play Store publication.
- Service worker may cache static resources intentionally; **never cache private financial API responses, protected user HTML, authentication tokens, CSV exports or secret-bearing responses**.
- Offline V1: show explicit unavailable/retry state for finance mutations; do not claim offline financial tracking/sync. No unsafe queued writes without designed conflict handling.
- Updates: version assets, control stale client behavior, ensure state continuity when a deployment changes.

## Tests
Manifest validation, installed navigation, icon quality, standalone status, mobile safe-area usability, cache scope review, offline API failure feedback, update handling, no cross-user persistent cache, session expiry while installed.
