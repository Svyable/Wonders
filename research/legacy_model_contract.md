# Wonders Through Time — scalable historical experience contract (v2)

**Promise:** a living, source-aware chronology that can expand from two sites to hundreds without quietly blurring evidence, dating or geometry.

## Site schema

Every published site should have: `site_id` (stable, unique), `name`, `country/region`, `period`, `experience_mode` (measured 3D / hypothetical 3D / diagram / map), `sources`, `events`, `research_status`, `model_limitations` and a working open/return control. The packaged `SITE_REGISTRY.json` lists what exists today. Candidate sites remain explicitly unpublished.

## Event schema

| Field | Meaning |
|---|---|
| `site_id` | Which site owns the event. |
| `year` | Signed historical year; negative for BCE, positive for CE; approximate when uncertain. |
| `title`, `description` | Accessible narrative, original summary. |
| `category` | **Physical** state, **testimony** from a historical witness, or **science** (documentation, discovery, interpretation). |
| `evidence_basis` | Source category, never silently interchangeable with confidence. |
| `scene_effect` | Allowed visual state change; a modern discovery cannot create the ancient structure. |
| `scene_warning` | Limits on precision, reconstruction and interpretation. |
| `sources` | Traceable outgoing links, ideally primary or institutional. |
| `human_context` | People, labor, craft, food, society, not just buildings. |

Dates must not be presented as equally certain. A site can have several overlapping clocks; the shared chronology sorts by event date but **does not impose a single fixed ancient timeline scale**. Original site-specific date progression may be nonlinear for detailed eras.

## Editorial gates before publishing site 03

1. Source every event from actual accessible institutions, primary texts or peer-reviewed research.
2. Mark ancient reports, estimates, artist impressions and confirmed excavation separately.
3. Maintain a working offline or low-power view; if 3D requires an external library, provide an honest fallback.
4. Preserve existing sites and their controls; new site modules must not rewire the existing 3D camera or erase local content.
5. Test cross-site navigation, global search, date jump, small-screen layout, keyboard close and no console errors.
6. Package one standalone HTML **plus** editable source and structured event exports. Validate archive integrity.

**No unmeasured labyrinth tunnels as fact, no invented 20,000-person Hawara workforce, no hidden 2025 radar confirmation.**
