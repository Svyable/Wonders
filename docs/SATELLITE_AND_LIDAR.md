# WonderTime 4 — Geographic imagery and remote-sensing evidence

## Planet Earth

The default globe embeds `assets/earth.webp`, a downsized WebP rendition of the **NASA Blue Marble Next Generation** image bundled with the Python Basemap data package as `bmng.jpg` (5400 × 2700 JPEG). NASA's source composite is modern remote sensing, **not a reconstruction of Earth in 2500 BCE**. The 4096 × 2048 WebP file is bundled, and the globe can render without an internet connection.

Provenance: NASA Earth Observatory, *Blue Marble: Next Generation*, Reto Stöckli and Robert Simmon / NASA GSFC. Source collection: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/

The previous handmade, flat biome texture has been replaced. The WebGL latitude orientation was also corrected so the north pole and labels no longer disagree. A Canvas fallback is retained.

## Surface approach

Scroll toward the planet or use the concentric-circle globe control to enter a *geographic approach*. On entry, the interactive map centers on the current globe coordinate. Drag to pan, scroll or use the globe plus/minus buttons to zoom, and use **Back to orbit** to return. The map renderer uses the standard Web Mercator XYZ tile layout. It requests **only visible tiles**, and browser HTTP caching controls tile re-use.

* **Offline fallback:** a locally cropped view of the embedded NASA texture. It gives regional context, not street-resolution imagery.
* **NASA GIBS:** BlueMarble_NextGeneration, Web Mercator zoom 3–8, publicly documented service with the NASA link visible on screen. https://nasa-gibs.github.io/gibs-api-docs/access-basics/
* **EOX Cloudless 2016:** Sentinel-2 2016/2017 satellite mosaic, Web Mercator zoom 9–14, requires network and permits commercial reuse under **CC BY 4.0** with attribution. The viewing-product license/attribution is displayed on the map. https://cloudless.eox.at/license-non-commercial and https://cloudless.eox.at/documentation/license

These public hosted tiles are an optional online enhancement, subject to service availability and rate limits. For production at scale, configure commercial or self-hosted tile services rather than relying indefinitely on public fair-use endpoints. The imagery is a modern reference and does not change when the historical time dial moves.

## Discovery Lab

The five exhibits represent peer-reviewed research on **Angkor**, **Caracol**, **Maya lowlands in Guatemala**, **Campeche/Valeriana**, and the **Casarabe culture of Bolivia**. The application provides the original source title, publication year, research claims, survey scope, date of the ancient landscape, evidence limitations and region-level map anchor.

Crucially, the shaded relief and architectural geometry in `source/discovery_lab.js` are **synthetic original visualizations**. The visualization does **not** contain DEMs, raw LiDAR points, surveyed building polygons, copied published figures, or verified building dimensions. The canopy wipe teaches a methodology; it is not an authentic animated archaeological scan. Controls and labels say this explicitly. New measured geometry must be acquired under an appropriate license, georeferenced, validated and tagged by evidential status before being portrayed as a scan.

Primary research:

- Damian Evans et al., *Uncovering archaeological landscapes at Angkor using lidar*, PNAS (2013): https://pmc.ncbi.nlm.nih.gov/articles/PMC3732978/
- Arlen Chase et al., *Airborne LiDAR, archaeology, and the ancient Maya landscape at Caracol, Belize*, Journal of Archaeological Science (2011): https://doi.org/10.1016/j.jas.2010.09.018
- Marcello Canuto et al., *Ancient lowland Maya complexity as revealed by airborne laser scanning of northern Guatemala*, Science (2018): https://pubmed.ncbi.nlm.nih.gov/30262469/
- Luke Auld-Thomas et al., *Running out of empty space: environmental lidar and the crowded ancient landscape of Campeche, Mexico*, Antiquity (2024): https://www.cambridge.org/core/journals/antiquity/article/running-out-of-empty-space-environmental-lidar-and-the-crowded-ancient-landscape-of-campeche-mexico/FFDB435047017853F26CFC5D8804B08D
- Heiko Prümers et al., *Lidar reveals pre-Hispanic low-density urbanism in the Bolivian Amazon*, Nature (2022): https://www.nature.com/articles/s41586-022-04780-4

Published metrics are not automatically transferable from the studied survey area to the whole civilization. For example, identified LiDAR structures are not a direct census.

## Next fidelity upgrades

1. Obtain source-authorized GeoTIFF/LAZ/DEM or measured polygons for a pilot site.
2. Record CRS, vertical datum, scan resolution, collection date, object type, georeferencing transformation, and rights.
3. Build downsampled terrain mesh and map vector footprints with dataset-specific accuracy disclaimers.
4. Compare to ground archaeology; label measured returns vs archaeological interpretation vs generated missing structures.
5. Introduce progressive mesh loading and level-of-detail controls rather than embedding multi-gigabyte scans in one HTML page.
