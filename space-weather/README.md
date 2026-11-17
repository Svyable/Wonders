# MAGNETOSPHERE — Earth Now

A standalone near-real-time space-weather observatory inside the Wonders repository. It combines the visual grammar of **AEGIS** (the translucent global bow shock, magnetopause, magnetic line structures, and causal explanation) with the inspectable globe, layer toggles, and provenance discipline of **TERRA**.

**Launch:** serve this folder over HTTP (not `file://`):

```bash
cd space-weather
python3 -m http.server 8000
# open http://localhost:8000/
```

No build step or API key is required. An internet connection and a WebGL-capable browser are required for Three.js, Earth imagery and live feeds.

## What works

- Orbit, zoom, global/Earth/tail camera presets, autospin, PNG export and URL-persisted layer toggles.
- Empirical Shue-type magnetopause parameterized by measured solar-wind speed, density and GSM Bz; an outer **illustrative** bow shock and **illustrative** closed-field dipole curves.
- Solar wind stream, transparent magnetotail plasma sheet, optional geosynchronous-radius shell.
- NOAA 1-minute L1 solar-wind magnetic/plasma measurements, NOAA 3-hour Kp index, and NOAA OVATION **forecast** points on the globe when available and current.
- Optional GFZ Potsdam Hp30 index (may be blocked by source CORS).
- A four-hour playback scrubber over received NOAA measurements. The current OVATION forecast is not shown as if it were a historical archive.
- L1-to-Earth travel-time estimate (1.5 million km / wind speed); the Earth-state boundary uses a sample whose estimated arrival is **not later** than the chosen viewing time.
- Explicit fresh/stale/offline signals. If propagated observations are missing, the visualization uses a clearly labeled quiet **illustrative baseline**, not fake telemetry.

## How the physics is separated

| Layer | Provenance | Meaning |
| --- | --- | --- |
| Speed, density, IMF Bz | NOAA SWPC upstream in-situ feed | Measurements near L1, not at the magnetopause |
| Magnetopause | Shue-type empirical model | Model boundary driven by estimated-arrived L1 inputs |
| Bow shock, field lines, plasma sheet and particles | Visualization schematic | Orientation and broad concepts only; not an MHD simulation |
| OVATION dots | NOAA | Short-term auroral **model forecast**, not visible-light measurements |
| Kp | NOAA | Three-hour geomagnetic index |
| Hp30 | GFZ | Thirty-minute index, optional |
| Earth texture | three.js example imagery | Geographic context |

**Caveats:** Propagation time is approximate and assumes a constant 1.5 million km distance. Real plasma parcels, solar-wind discontinuities, and spacecraft position introduce uncertainty. The auroral layer follows a forecast grid, not an archived movie. Do not rely on this application for operational risk decisions.

## Source links

- [NOAA real-time solar wind](https://www.spaceweather.gov/products/solar-wind)
- [NOAA aurora 30-minute forecast / OVATION](https://www.spaceweather.gov/products/aurora-30-minute-forecast)
- [NOAA geospace model movies](https://www.spaceweather.gov/products/geospace-magnetosphere-movies)
- [GFZ index downloads and API](https://kp.gfz.de/en/data)
- [AEGIS by skracht, MIT](https://github.com/Kracht/AEGIS)
- [TERRA by Terry Elemans](https://terra.terryelemans.nl/)

## Attribution and reuse

New code in this subdirectory was written as an independent implementation. AEGIS (MIT) and TERRA are credited as reference experiences; this code does not copy TERRA source. Third-party data, imagery and runtime libraries retain their respective terms. Verify source-specific license requirements before redistributing textures or integrating code into commercial applications.

## Development notes

This is a first functional prototype, not a claim that the whole magnetosphere is directly observed in real time. Next engineering steps: validate NOAA's live 2026 response shape in-browser, add instrument-source selectors and quality flags, replace schematic bow-shock modeling with proper Mach-number inputs, add real ephemeris-based L1 propagation, and perform visual/mobile testing.
