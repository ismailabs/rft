# Brand asset provenance

- `google-g.png`: authentic multicolor Google G from https://developers.google.com/static/identity/images/g-logo.png, retrieved 2026-10-24. Used only in Google sign-in buttons following https://developers.google.com/identity/branding-guidelines. This is Google's mark, not an RFT logo or a general open-source icon. The owner approved white buttons in the existing reference positions on 2026-10-24.
- `../fonts/google-sans/google-sans-500.woff2`: Google Fonts API subset for the exact English and Malay Google button labels, Google Sans Medium. Retrieved 2026-10-24; licensed under SIL OFL 1.1, included as `../fonts/google-sans/OFL.txt`. Only button text uses this font; the application keeps its local DM Sans.
- `rft-leaf.svg`: code-native RFT geometry derived from the approved five visual references, matching `src/components/brand.tsx`. Install PNGs are deterministic renders of this SVG on white, with a maskable safe zone. This does not restore or reuse the removed old round-logo source.

All are served locally. No font or image request to Google occurs at runtime.
