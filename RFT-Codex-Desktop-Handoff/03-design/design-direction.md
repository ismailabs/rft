# No AI slop — design direction and creative standard

**Approval:** user requires original, minimalist, elegant, psychologically considerate and trustworthy Malaysian personal finance UX. Existing mockup assets are *mandatory references*; visual tokens remain provisional until real image inspection.

## Design intent
Quiet competence, financial clarity, legible numbers, fast actions, accessible mobile layout, understandable categories and personal autonomy. Favor fewer, higher-value elements over an accounting dashboard overloaded with metrics. A restrained distinct brand may use warmth, roundness and subtle muted accents, but do not impose any proposed color blindly.

## Explicit anti-patterns
No repeated identical cards as a generic SaaS template; flashy gradient/glassmorphic surfaces without purpose; random purple/pink chrome; huge glowing charts; decorative badges/eyebrows; invented user testimonials or institutional endorsements; fake data portrayed as real; meaningless motion; tiny grey text; overwhelming forms; motion on every scroll; slogans that obscure function; inconsistent illustrations; emoji substituted for icons.

## Before implementing UI
1. Inspect all 21 `assets/` PNGs **visually**, not filenames only. Identify logo, favicon, bank icons, mockup frames, design references and composite sheets; report unknowns.
2. Compare related concepts; select an intentional aesthetic consistent with actual mockups and core function. Preserve approved brand identity when recognizable.
3. Specify compact design tokens, numerical hierarchy, mobile navigation, real content, empty/loading/error states.
4. Use installed `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines` selectively; do not accept skills' generic defaults contrary to RFT/user requirements.
5. Implement and **inspect real browser screenshots** on representative mobile, tablet and desktop widths, repair mismatch and usability defects.

## Visual acceptance
User can find balance quickly, add expense with few interactions, distinguish period cash flow from end balance, and navigate without decorative noise. Forms remain readable with mobile keyboard; graphs are secondary explanatory aids. Do not ship mockup raster images pretending to be functional UI.
