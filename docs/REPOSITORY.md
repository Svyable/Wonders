# Svyable/Wonders repository

This is the canonical source for **WonderTime**, an evidence-aware planetary atlas of places through time. The distribution format is a single `index.html`, reconstructed from editable data and engine source using Python's standard library.

## Workflow

1. Edit `source/sites.json`, `source/portals.json` and `source/civilization.json` for location metadata and contextual changes; keep linked phase dates aligned.
2. Edit `source/timeportal_engine.js` for procedural rendering and `source/timeportal_markup.html` / `timeportal.css` for UI.
3. Run `python source/validate.py && python tests/civilization_contract.py && python source/build.py`.
4. Confirm the built `index.html` changed and commit **both source and built artifact**.
5. Run `python tests/timeportal_regression.py` if Playwright + Chromium are installed. Do not claim this external browser test ran in GitHub Actions (CI only verifies data/build determinism).

## Provenance, evidence, and licensing

Historical content sources are linked in the data and under `docs/`. Renderings are original procedural illustrations; not measured archaeological geometry. The preserved Giza/Hawara atlas is included in source and embedded in the one-file build. Third-party archaeological scans, photographs, drawings and photogrammetry should never be imported without rights review. Public GitHub visibility does not automatically license external data or imagery for reuse.

## Future schema

Add fields for measured geometry references, license, provenance, archaeological dating intervals, disputed interpretations, and survey revisions. Avoid fabricating calendar-exact construction dates or population interpolation from sparse archaeological samples.
