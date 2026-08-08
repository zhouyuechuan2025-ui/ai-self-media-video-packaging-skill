# Multicolor Center-Speaker Packaging Design

## Status

Approved by Nana on 2026-08-08. Implementation may proceed only against this specification. The public project must describe its capabilities directly and must not discuss private tooling, omitted systems, or hidden implementation sources.

## Problem

The current renderer advertises eighteen structures, but every structure passes through one dark rounded `StructureShell`. The result changes labels and minor decorations while preserving the same panel silhouette, typography hierarchy, shadow, and single cyan accent. The real-case preview therefore looks like one card repeated across the whole video.

The current `center` placement also centers an opaque 760-pixel panel over a presenter. For a horizontal talking-head video with the speaker in the middle, this is the opposite of a center-safe layout.

## Audience and source contract

- Primary source: 1920x1080 horizontal talking-head footage.
- Presenter: normally centered.
- Existing burned-in captions remain authoritative and are never duplicated.
- Source video and source audio stay continuous unless a future job explicitly authorizes a recut.
- Graphics explain, structure, emphasize, or show evidence; they do not invent claims.

## Layout contract

### Protected regions

- Presenter-safe center: x = 35% to 65% of frame width.
- Left overlay lane: x = 6% to 32%.
- Right overlay lane: x = 68% to 94%.
- Burned-in subtitle band: bottom 18% of the frame.
- Ordinary overlays must not place opaque panels or essential text in the presenter-safe center or subtitle band.

### Allowed coverage

- `speaker-left`: content occupies the left lane and leaves the center transparent.
- `speaker-right`: content occupies the right lane and leaves the center transparent.
- `full-screen`: content may cover the presenter for 1.0-2.2 seconds and is reserved for an opening hook, chapter transition, or closing payoff.
- Evidence takeover may exceed 2.2 seconds only when the source requires readable evidence and the Gate A plan explicitly records the reason.

### Rhythm

- Side lanes alternate; the same side cannot appear twice consecutively unless one intervening beat is a full-screen scene or breathing beat.
- One template appears at most three times and never on adjacent beats.
- No more than two strong or full-screen scenes in succession.
- The planner must not assign a graphic to every subtitle merely to fill time.

## Visual families

### 1. Impact Question

- Use: opening question, contradiction, major turn.
- Motion: question hit, counter-line slide, conclusion stamp.
- Palette: Deep Ocean (`#0B1325`, `#FF6846`, `#55D7FF`).
- Coverage: full-screen only at approved hook/turn boundaries.

### 2. Gradient Keyword

- Use: one dominant term or short conclusion.
- Motion: gradient charge, word lift, underline sweep.
- Palette variants: Violet Sunset and Cobalt Magenta.
- Coverage: speaker-left or speaker-right; no opaque center panel.

### 3. Signal Route

- Use: workflow, connection, feedback loop, tool chain.
- Motion: route trace, node activation, pulse travel.
- Palette: Teal Signal (`#071B22`, `#55D7FF`, `#54F2D2`) or Coral Signal.
- Coverage: two side clusters connected around, not through, the presenter-safe center.

### 4. Editorial Stamp

- Use: correction, judgment, locked conclusion.
- Motion: editorial line reveal followed by a physical stamp.
- Palette: Editorial Cream (`#F4F0E8`, `#18181B`, `#D92D20`, `#2563EB`).
- Coverage: speaker-left/right for ordinary judgments; full-screen only for a chapter conclusion.

### 5. Completion Rail

- Use: execution checkpoints, QA, next action, CTA.
- Motion: ordered rails fill and the final state stamps in.
- Palette: Acid Action (`#111827`, `#C7F000`, `#FACC15`) or Navy Cyan.
- Coverage: edge rails above the subtitle band; center remains transparent except for an approved closing payoff.

### 6. Programmatic Doodle

- Use: abstract mechanism, difficulty, tradeoff, speed, path, or before/after.
- Motion: deterministic layered SVG pieces driven by frame progress.
- Palette: warm paper, relaxed black line, one low-saturation semantic accent.
- Coverage: side illustration or brief full-screen chapter illustration.
- Boundary: a drawing is explanatory and is never presented as evidence.

## Palette system

Palette selection is semantic, not random. Each storyboard beat stores a palette identifier. The renderer resolves that identifier through one registry so Remotion and the optional adapter share the same colors.

Required palettes:

1. `deep-ocean`: navy, coral, ice blue.
2. `violet-sunset`: violet, magenta, warm orange.
3. `teal-signal`: dark teal, mint, bright blue.
4. `editorial-cream`: cream, ink, Chinese red, cobalt.
5. `acid-action`: charcoal, acid green, yellow.
6. `paper-sketch`: warm paper, ink, muted semantic accent.

For a real case longer than 30 seconds, validation requires at least four palette identifiers and five visual structures. Adjacent beats may not repeat the same `structure + palette` combination.

## Real-case direction: Auto Editing 0

The authorized local MP4 and SRT remain the source for the public real-call case. The source files remain private.

The revised sequence must contain:

- a three-stage full-screen impact hook;
- alternating left/right gradient-keyword and editorial beats;
- one route or process scene;
- one programmatic doodle scene;
- one before/after or attributed metric treatment;
- one completion/CTA scene;
- at least four color families in the actual rendered output.

The public preview must be extracted from the newly rendered MP4, not from isolated component mocks. It must include at least six frames covering a full-screen hook, left speaker-safe scene, right speaker-safe scene, signal route, doodle, and completion/closing scene.

## Public documentation

The README and Skill must state that the workflow targets center-presenter talking-head footage and must explain the two side lanes, protected center, subtitle band, and limited full-screen exceptions.

The plan-first contract remains mandatory:

1. inspect MP4/SRT and create Gate A;
2. present the proposed beat map, layout, palette, factual boundaries, and evidence needs;
3. stop;
4. continue only after explicit approval for that job.

## Validation

Automated checks must cover:

- generated 16:9 talking-head beats use only left, right, or approved full-screen placement;
- ordinary beats never resolve to an opaque centered panel;
- real cases over 30 seconds use at least four palettes and five structures;
- adjacent beats do not repeat a `structure + palette` pair;
- no template appears more than three times;
- no two ordinary side beats use the same side consecutively;
- full-screen use is limited to allowed director roles;
- caption mode remains burned-in without a generated caption track;
- all new SVG paths are safe from default black fills;
- actual output decodes with ffmpeg, matches source duration tolerance, has no sampled black frames, and supplies verified preview hashes;
- public repository scan finds no private source media, credentials, cookies, tokens, local browser state, or private-tool wording.

## Non-goals

- Reproducing an entire authoring application.
- Publishing private source footage or SRT content.
- Adding payment, deployment, production data, or online account access.
- Creating dozens of nearly identical skins.
- Claiming drawings, counters, or generic graphics as proof.
