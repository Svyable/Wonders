# WonderTime Timeportal contract — v2.0

## 1. Meaning of “4D”
A Timeportal makes *space and historical time* navigable together: a rotatable 3D-style visual model plus an adjustable temporal state. It does **not** render literal 4-spatial-dimensional geometry and is not a scientific 4D archaeological simulation.

## 2. Fidelity ladder
- `conceptual`: representative architectural types, unscaled. **All new Timeportals in this edition are here.**
- `sourced_reconstruction`: an explicit scholarly hypothesis using plans, published measurements and alternative interpretations, showing uncertainty.
- `measured_survey`: survey-coordinated 3D geometry with linked methodology, uncertainty and rights.

Do not silently promote `conceptual` to `measured_survey`. Scene detail should not imply unsupported precision. An instrument anomaly is not an excavated room.

## 3. Input schema
For each portal, JSON supplies `id`, `kind`, `palette`, `source`, `caveat`, `renderer`, and exactly three `stages`. Each stage has `year` (signed integer BCE/CE approximate marker), `name`, and `story`. Date precision is descriptive, not reconstructed to a single exact year. Context for changes belongs in story rather than invented geometry. A portal matches one site record by ID.

## 4. Rendering engine
The app draws perspective-projected 3D faces using Canvas 2D (boxes, columns, conical frustums, terraces, rings, walls, etc.). It uses a painter's algorithm plus ground/structure layering; no external 3D library is required. Visuals are unscaled narrative dioramas. The engine keeps a camera yaw, pitch and zoom, and maps historical stages to progress `[0,2]`. The global globe's year can synchronize on portal exit. The site-level source links are discoverable in the portal.

## 5. Adding a high-quality new site
1. Create and verify site coordinates, geographic name, approximate chronological range and links.
2. Add a coherent, three-stage *documented* narrative with source provenance.
3. Choose or author a visual kind using recognizable, verified architectural typologies. Label all hypothetical details.
4. Add first-party or appropriately licensed measured assets when available; do not import other creators' figures, maps or imagery without permission.
5. Run validation and browser tests at desktop and mobile sizes, confirm the controls, and check all temporal transitions for anachronisms.
6. Promote fidelity only after source-specific review. All changes should remain reversible.

## 6. Key cautions
The original Giza/Hawara scholarly distinctions are preserved. In particular, Hawara's classical labyrinth accounts and geophysical anomalies do not establish a verified room-by-room underground plan. Modern discoveries are discovery events, not the construction dates of physical chambers. No externally licensed reconstruction assets are embedded in the 22 Timeportals.
