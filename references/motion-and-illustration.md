# Motion and integrated line illustrations

## Seek-safe motion primitives

`hit`, `slide`, `lift`, `stamp`, `route`, `trace`, `count`, `reveal`, `relay`, and `focus` are deterministic functions of frame, fps, start frame, and duration. The same frame must always render the same state.

- Use `hit` for a short hook or conclusion, not every heading.
- Use `route` and `trace` for actual paths, loops, and staged progress.
- Use `count` only for attributed metrics.
- Use `focus` for a selected command, source, or proof detail.
- Never use timers, random values, runtime state, or CSS transitions that depend on playback history.

## Semantic doodle contract

An integrated doodle has three explicit layers:

1. `line`: the subject and stable environment;
2. `action`: the force, route, movement, or transformation;
3. `outcome`: the resulting state.

The `semantic-doodle` structure keeps the drawing inside the composition hierarchy instead of placing it in a detached generic card. It receives `subject`, `action`, `outcome`, and one accent color from the storyboard.

Use programmatic SVG with explicit `fill="none"`, explicit stroke attributes, rounded caps/joins, and frame-derived drawing progress. Avoid logos, brand imitation, decorative text inside the drawing, and unsupported product claims.

Existing reusable drawing scenarios include information overload, climbing a difficult path, balancing tradeoffs, following a fast route, activating connected nodes, and showing a before/after transformation. The semantic content decides which scenario is valid.
