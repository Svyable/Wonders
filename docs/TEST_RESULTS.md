# WonderTime 2.0 — verification notes

**Environment:** headless Chromium in a local container. Tested the standalone HTML source with Playwright at desktop (1440 × 900) and mobile (390 × 844).

**Passed in the current build:** globe initialization, 24 site markers plus coordinate waypoint marker, opening and closing the new Timeportal, 22/22 unique site scene render paths with non-uniform Canvas contents, three Petra stage transitions with changing image checksums, mobile and desktop without top-level page exceptions, existing catalogue and chronology features, rendering still exports, and navigation from site sheets.

**Retained existing tests:** the previous tests also cover the 24-site catalogue, the 82-event chronology, and Hawara's 17 events. The legacy Giza 3D rendering remains dependent on a separate online Three.js library and needs a browser with working WebGL to verify full parity. Source-level assertions cannot prove all historical hypotheses or physical accuracy.

For repeatable verification: `python source/validate.py`, `python source/build.py`, `python tests/regression_playwright.py`, `python tests/timeportal_regression.py`.
