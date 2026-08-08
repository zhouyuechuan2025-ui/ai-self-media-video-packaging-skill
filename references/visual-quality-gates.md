# Blocking visual quality gates

These checks apply to every real invocation. Passing unit tests, typecheck, build, or render is not visual acceptance.

## 1. Binary presentation mode

Every beat declares exactly one visual mode:

- **Presenter-safe:** the live presenter remains visible. Foreground content is restricted to x=5%–32% or x=68%–95%; center x=35%–65% is completely clear; the lower 18% is reserved for burned-in captions.
- **Opaque full-screen:** the graphic covers the full 1920×1080 canvas with an opaque background. It may use the center because the presenter is intentionally replaced for that beat.

Reject any translucent hybrid. A card, SVG route, illustration, glow, title, or diagram that enters the presenter lane while the face remains visible is a failure. If the center is needed, use opaque full-screen.

## 2. Side-card density

Presenter-safe side surfaces must be content-fit.

- Do not stretch a card from a fixed top to a fixed bottom.
- Maximum card height is 64% of the frame.
- Do not leave a decorative empty lower half.
- Use one rail when there is one idea. Use two rails only when the narration genuinely contains two complementary groups.
- Headings, items, and takeaway must participate in normal document flow; do not pin a footer far below sparse content.

## 3. Full-screen composition

- The background must be fully opaque from edge to edge; no transparent final gradient stop.
- The visual hierarchy needs one clear primary element, one supporting structure, and one result or source label.
- A process route or illustration may cross the center only in this mode.
- Critical content stays out of the lower 18% caption reserve unless the source is explicitly caption-free.

## 4. Stable review frames

Representative stills are selected at 72% of each beat, after the main entry animation but before the exit. A midpoint screenshot is not sufficient because it can capture a half-built layout.

Gate C must include:

1. eight frames from eight distinct semantic structures when the video semantics support them;
2. the exact timestamp, structure, presentation mode, and SHA-256 for every frame;
3. a 4×2 contact sheet built from those exact frames;
4. manual frame review, recorded as pass/fail for face safety, density, clipping, contrast, semantic fit, and subtitle clearance.

## 5. Blocking decision

Any of the following blocks Gate D:

- presenter lane partially covered;
- opaque scene not actually opaque;
- side card visibly padded with unused space;
- content clipped, overlapping, or too small to read;
- screenshot captured before the composition reaches a stable readable state;
- structure selected for visual variety rather than spoken meaning;
- evidence treated as decoration or an illustration treated as proof;
- any manual review item left unchecked.

After fixes, regenerate the real screenshots and review the new images. Do not reuse screenshots from a rejected render.
