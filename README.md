# WonderTime 3.0 — The World Is a Time Machine

**Release:** 16 November 2026 · **Format:** one portable HTML application with an editable source package.

WonderTime has become a 24-site planetary atlas: **two legacy deep site atlases (Giza and Hawara)** and **22 new interactive, evidence-labelled Timeportals**. A Timeportal is a real-time orbitable *3D-style conceptual diorama* with a three-stage temporal progression and an evidence-labelled civilization HUD. It is not a laser scan, measured reconstruction, photogrammetry model or archaeological ground truth.

## Run

Open `index.html` in an up-to-date browser. The globe, local natural-language destination guide and the new Timeportals work **without external scripts or an API key**. For the original Giza deep atlas, browser-native gzip decompression is required, and its original online Three.js renderer still needs an internet connection; an existing 2D fallback is retained.

## Explore

1. Spin the Earth or type a destination, such as “take me to Stonehenge,” “take me to Petra,” or “take me to Machu Picchu.”
2. Tap the location and **Enter 4D Timeportal**, or use the Timeportal quick jump in the right-hand rail. For an explicit “take me to...” search, the Timeportal opens directly.
3. **Drag** the model to orbit, scroll or use **+/−** to zoom, **Reset view**, **PNG** to export the current rendering, or **Play history** to move through three interpretive phases. Buttons let you jump between phases. Mobile supports dragging and pinch zoom.
4. Select **Earth** to return to the globe. Choosing a stage also updates the global year when you return.

## Experiences

- **22 locations with distinct scene compositions:** Göbekli Tepe, Stonehenge, Petra, Machu Picchu, Angkor, Chichén Itzá, Teotihuacan, Borobudur, Rapa Nui, Nan Madol, Tikal, Great Zimbabwe, Pompeii, the Colosseum, the Great Wall, Taj Mahal, Abu Simbel, Sigiriya, Mohenjo-daro, Lalibela, Persepolis and Sacsayhuamán/Cusco.
- Every Timeportal has **three named, dated story phases**, a visual evidence limitation, a time-scoped civilization HUD and a source link.
- The civilization HUD shows language, writing/records, political setting, engineering, ecological/economic context and population estimates **only when scope and evidence justify a number**. The HUD never synthesizes population-by-year curves.
- Pompeii now has representative urban architecture and ash-fall stages; Great Zimbabwe, Mohenjo-daro and Lalibela have substantially revised silhouettes.
- **Original Giza and Hawara experiences are preserved** as embedded deep atlases, with their shared **82 research chapters**.
- Planetary globe, coordinate waypoints, catalogue, comparisons, chronology and bookmarks stay available.

## Source layout

| File | Purpose |
| --- | --- |
| `source/sites.json` | Georeferenced 24-site registry; two sites retain `immersive` status, others remain research-level `preview` status plus a new Timeportal scene. |
| `source/portals.json` | Declarative 22-portal phase data: scene kind, color palette, period labels, summaries, evidence caveats, source link. |
| `source/civilization.json` | Evidence-qualified, 66-stage civilization context dataset with scoped population claims. |
| `docs/CIVILIZATION_DATA_POLICY.md` | Rules for temporal attribution, evidence classes and population comparisons. |
| `source/timeportal_engine.js` | Offline Canvas software 3D rendering, camera orbit, phased architecture, controls, PNG export. |
| `source/timeportal.css` | Timeportal desktop/mobile UI. |
| `source/timeportal_markup.html` | Portal interface template. |
| `source/template.html` | Assembled shell + embedded engine source, using placeholder tokens. |
| `source/chronology.json` | Existing 82 Giza/Hawara historical chapters. |
| `source/legacy_giza_hawara_v2.html` | Preserved deep Giza/Hawara atlas. |
| `assets/earth.webp` | Locally generated globe art, not geospatial or satellite proof. |
| `source/build.py` | Standard-library single HTML builder. |
| `source/validate.py` | Geographic and portal data validation. |
| `tests/` | Desktop, mobile, navigation and rendering smoke tests. |

Rebuild with `python source/validate.py`, `python tests/civilization_contract.py`, then `python source/build.py`. The output is `index.html`.

## Historical honesty and limitations

These scenes are **artistically interpretive models**, drawn with code using generalized architecture types (circles of stones, stepped pyramids, walls, terraces, rock facades, temple spires). They are deliberately **not presented as precise 3D reconstructions** of every site, do not have real-world scale and must not be mistaken for measured terrain, interiors, exact construction sequences or scanned buried structures. Stage dates are broad historical navigation anchors, not proof of a precise day, year, or architectural phase.

Historical sources can document an object without establishing its lost full geometry. Modern scenes for preserved Taj Mahal, Abu Simbel, Borobudur, Lalibela and others intentionally avoid depicting imaginary wholesale collapse. Pompeii's last phase is the **eruption in 79 CE**, not present day.

All curated initial links are stored in `source/sites.json` and repeated in `source/portals.json`. For stronger future editions, upgrade each location with period-specific scholarly event citations, excavated plans, optional rights-cleared photogrammetry / LiDAR / point clouds, measured dimensions and localized terrain. Until then, site-specific caveats appear directly beside each rendering.

**Not a connected LLM:** the search assistant is an offline rules-based guide. No API key, MCP server, live search, satellite feed or remotely hosted AI powers the initial app.