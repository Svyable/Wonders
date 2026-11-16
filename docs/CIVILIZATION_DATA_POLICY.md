# Civilization HUD: evidence contract (WonderTime V3)

**Goal:** put people, language, writing, institutions, environment and engineering beside the monuments **without manufacturing numeric time series**.

## Data structure

`source/civilization.json` records 22 site profiles and 66 historical phase snapshots. Snapshot phases reference the exact phase `year` and `label` in `source/portals.json`, and facts inherit site-level properties only when no period-specific override is supplied.

- `languages` is a historically grounded language association, **not** a claim to know what an individual visitor or worker spoke.
- `writing` distinguishes attested systems from undeciphered signs, liturgical languages and nonalphabetic record keeping.
- `polity` refers to the local historical setting, not modern sovereignty or an imagined homogeneous civilization.
- `engineering` and `ecology` describe relevant site-level practices and constraints.
- `population` is **null by default**. Only records with an explicit documented source, place/area, time, method and uncertainty label may show a number.
- The Timeportal HUD **switches** between named phases. It does not interpolate estimated populations or generate synthetic year-by-year change.
- The global date dial shows a clearly named nearest **site lens**, not a dated global statistic.
- The present-day heritage phase never treats nearby modern city demographics as ancient site population.

## Numeric population records currently displayed

| Site | Figure | Reference place and period | Critical qualification | Source |
| --- | --- | --- | --- | --- |
| Pompeii | 12,000–16,000 | City, near 79 CE | A published demographic estimate, **not** a census; immediately before the eruption | [Pompeii Commitment / Gallo](https://pompeiicommitment.org/en/a-city/) |
| Greater Angkor | 700,000–900,000 | ~3,000 km² metropolitan region, 13th-century peak | Modelled catchment total, **not** a count of Angkor Wat temple residents | [Klassen et al., Science Advances (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8104873/) |
| Teotihuacan | At least 25,000 | Ancient city in the broad 1st–7th century CE development span | Conservative UNESCO floor, **not** a precise peak | [UNESCO](https://whc.unesco.org/en/list/414) |

No population for Stonehenge, Göbekli Tepe, Great Zimbabwe, or the ritual temples is invented from site area. More defensible demographic research should be added as individually peer-reviewed, area-specific data points, not by applying a universal density multiplier.

## Architecture / visual honesty

All Timeportal models are **illustrative software dioramas**. They are not measured meshes. In the Pompeii reconstruction, the forum, road system, urban blocks, atrium courts and amphitheater depict **architectural types**, not their surveyed location. Ash fall and the eruption plume are evocative visual cues, not a depth model. The city was buried by **pumice, ash and pyroclastic deposits, not lava**. The site retains multiple historical phases before 79 CE rather than existing only in a single catastrophic snapshot.

For future editions, tie each structure to a georeferenced archaeological plan and add per-element geometry provenance, dating range and uncertainty. Promote a portal to **evidence-informed reconstruction** only after comparing it with rights-cleared excavation plans and expert reviews.

## Important scholarly background

- [Pompeii Archaeological Park, Roman housing](https://pompeiisites.org/en/pompeii-map/analysis/roman-housing/) — atria, impluvia, courtyards and the forms of domestic life.
- [Pompeii Commitment, A City](https://pompeiicommitment.org/en/a-city/) — the archaeological urban landscape and demographic caution.
- [Klassen et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8104873/) — modelling of Greater Angkor, with reference area and uncertainty explicitly stated.
- [UNESCO, Teotihuacan](https://whc.unesco.org/en/list/414) — city development and a conservative demographic floor.
- [UNESCO, Archaeological Areas of Pompei, Herculaneum and Torre Annunziata](https://whc.unesco.org/en/list/829/) — authoritative framing of the Roman sites.
