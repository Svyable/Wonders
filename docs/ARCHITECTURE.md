# Architecture — from WonderTime 1.0 to a planetary knowledge system

## Product principle

The globe is a **discovery interface**, not a claim that every site already has a measured 3D model. Historical time is a separate dimension. A site has geographic identity, physical chronology, cultural context, a knowledge provenance graph and optional immersive scenes.

## Current design

`index.html` bundles the map texture, site registry, original Giza/Hawara historical events, app logic and compressed two-site atlas. A site pin opens a fact-checked description, then a deep experience if available. The local guide resolves natural-language text against curated data. It does not impersonate a connected model.

## Long-term modules

1. **Earth / cartography:** location IDs, WGS84 coordinates or spatial extents, geocoding, regional clusters, place-name aliases, optional georeferenced tiles and a source-backed basemap.
2. **Time:** separate `event_occurred_at` vs `event_discovered_at` vs `event_documented_at`, ranges, uncertain dating, precision and possible conflicting chronologies. No retroactive pop-in of structures discovered in modern times.
3. **Evidence:** typed links among source, author, artifact, observation, interpreted geometry, uncertainty and competing hypotheses.
4. **Site renderer:** progressive WebGL/WebGPU 3D and 2D alternatives; assets streamed by site/LOD. Scenes must have provenance and visibility rules. Preserve geographic scale and indicate illustrative / out-of-scale models.
5. **Planet Guide:** retrieval-grounded language-to-navigation, returning typed destinations, years, filters and citations through a narrow API (not free-form generated geometry). Use a server proxy for hosted LLM credentials.
6. **Editorial tooling:** versioned site contributions, reviewer verification, immutable source URLs/DOIs, change logs, rights/accessibility/performance tests and archival export.

## Minimum portable site record

```
site_id, name, country, region,
anchor: {lat, lon, datum: "WGS84", uncertainty_m},
chronology: [{date_start, date_end, precision, evidence_source_ids}],
sources: [{id, url, title, author, year, license, retrieval_date}],
features: [{id, geometry_uri?, confidence, evidence_type, historical_interval}],
experience: "preview" | "exhibit" | "immersive"
```

Current version uses a deliberately simpler `sites.json` (flat lat/lon, `start`, period label and a leading source URL). Upgrade it only when concrete site material needs these more advanced fields.

## Scale phases

- **2 → 25**: one strong global interface and curated preview locations. This release.
- **25 → 100**: country/region search, clustering, source-indexed exhibits, route/atlas collections and editorial CMS. Replace monolithic data injection with static JSON chunks.
- **100 → 1,000+**: tiled geodata; search index; spatial database; content-addressed assets; model licensing; versioned knowledge graph; server-backed retrieval with citations; selective offline packs.

Do **not** put hundreds of 3D models in one HTML download. Preserve a single-page *experience*, but load data and renderer assets per site in production. The portable offline HTML remains a useful shareable edition, not the only long-term deployment topology.
