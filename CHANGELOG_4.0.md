# WonderTime 4.0 — The Geographic Earth / Discovery Lab

- Replaced the stylized planet texture with an embedded NASA Blue Marble satellite mosaic (4096×2048 WebP).
- Corrected a north/south sign mismatch in the WebGL shader that made the Earth appear upside down relative to location markers.
- Expanded zoom from a tiny ball-size adjustment to a geographic approach with panning, zoom 3–14, optional NASA GIBS / Sentinel-2 2016 tiles and an offline satellite fallback.
- Added five research-backed LiDAR discovery dossiers, accessible from the header and globe sidebar.
- Added original, interactive canopy/terrain reveal diagrams with togglable architectural feature interpretation and source links.
- Included distinction between modern discovery date and the archaeological landscape's historic era; published survey statistics retain their scope.
- Preserved 24 sites, 22 existing Timeportals, 82 Giza/Hawara historical chapters and the civilization timeline HUD.
- Added new offline/mobile testing covering globe rotation, surface entry/exit and all five discovery profiles.

Known limits: online map tile services cannot be tested in an isolated/offline browser; offline fallback is necessarily regional and not street-resolution. The LiDAR models are interpretive demonstrations, not raw scans or measured site models. The original Giza WebGL engine still requires its existing external rendering dependency and a separate browser validation.
