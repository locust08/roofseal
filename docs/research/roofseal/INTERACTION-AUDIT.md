# Prototype interaction audit

Date: 20 October 2026. Scope: all six Roofseal pages and their shared header/footer.

## Evidence

Compared the implementation with the saved prototype graph (163 nodes, 169 actions: 110 hover and 59 click actions), high-fidelity Figma component extractions, and newly fetched hover variants. Newly fetched source states are saved as hover-*.md. The prototype player URL in the browser requires login; connected Figma extraction remained available. This is a source-backed audit, not a claim of exhaustive pixel or motion equality.

## Corrections made

- Product and recommendation cards now use the same instant 0 10px 15px rgba(0,0,0,.1) shadow from hover variant28318:5165. Removed invented red title/border effects.
- Home project and About milestone arrows now transition to secondary red #B3161B and white chevrons over300ms ease-out, matching variants28318:4827/4834.
- All four brand panels switch instantly, matching their null-transition prototype reactions; removed the invented300ms fade.
- Products overlay now uses the source20px circular arrow icons, correct active/inactive arrow colors,100px category column gaps, source70% white background and rounded lower corners. Removed the added drop shadow. Desktop overlay measures approximately202px high.
- Corrected the shared footer Roof Covering destination to Metal Roofing Division, matching the prototype's recorded destination, rather than inferring a destination from its label.

## Browser checks completed

- All six routes: products menu opens; Escape dismisses it; Quote List opens and closes; empty newsletter input blocks submission; no horizontal overflow at the source desktop width.
- All six routes at390px: mobile navigation opens, products overlay opens, and Close navigation dismisses both.
- Clicked menu Roof Covering -> Metal Roof System category -> Roofseal Deck762. Destination routes match the source graph.
- Clicked all three Back controls: Roof Covering -> Division; System -> Covering; Product -> Division.
- Checked gallery thumbnail selection, Add to Quote, displayed quote item and removal.
- Clicked all five FAQ summaries; the initially open Expected life closes and the other four expand.
- Measured actual pointer-hover product recommendation: source border and heading colors retained; expected shadow applied.
- Measured actual pointer-hover project and milestone arrows: #B3161B background, white glyph,300ms ease-out transitions.
- Measured actual pointer-hover brand panel: opacity1, transition0s.
- Checked settled Submit hover: black face with the source300ms transition. The per-route browser JSON samples the start of that transition, so its recorded red face is an initial frame rather than a settled-color assertion.
- npm run check passed: ESLint0 errors (image optimization warnings), TypeScript, production build. git diff --check passed.

## Exact-match limits and required source inputs

- The graph references go-to-arrow hover variant28094:1639, but Figma returns an invalid/invisible-node selection. Its exact visual state cannot be verified. A visible copy/export of that variant or a repaired prototype reference is needed. Existing circular-arrow behavior is retained; no substitute is asserted to be exact.
- Full interactive prototype-player comparison needs access to its logged-in player. Node/style extraction verified authored states and link destinations, but is not a full player playback comparison.
- Several visible controls have no authored click action in the supplied graph: quote workflow, newsletter submission, catalogue download, gallery thumbnails, tertiary Read/Learn More, project tabs, timeline rotation, building hotspots and ESG switches. Existing local preview behavior is retained and must not be described as authored prototype behavior.
- Brochure PDF, alternate project category data, four expanded FAQ answers, additional ESG copy and unsupported page destinations remain unavailable. See QA-REPORT.md. These need actual source content for exact parity, rather than invented text or destinations.
- Complete mobile/tablet source frames are absent. Those layouts and their mobile navigation controls are adaptations.

No form data was sent to an external service. No deployment was performed.
