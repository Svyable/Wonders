# Planet Guide — language → place, time and evidence

## What works today

Local, deterministic query parsing for curated names/aliases, rough topic matching, regions, year expressions (`1800 BCE`), coordinate pairs (`48.8584, 2.2945`), and two-site comparisons. No hosted model and no geocoding of arbitrary place names. Unrecognized requests return suggestions rather than invented coordinates.

## Future optional secure service

A production UI can call a tiny application endpoint, **not an MCP server**:

`POST /api/navigate`

Example request:
```json
{"utterance":"Take me to the city of the Maya around 700 CE","current_view":{"lat":19,"lon":-89,"year":700},"known_site_ids":["tikal","chichen"]}
```

Example validated response:
```json
{
  "action":"show_results",
  "year":{"value":700,"precision":"approximate"},
  "destinations":[{"site_id":"tikal","score":0.87}],
  "explanation":"Tikal is a relevant Maya center documented for this period.",
  "citations":[{"source_id":"unesco-tikal","url":"https://whc.unesco.org/en/list/64/"}],
  "needs_clarification":false
}
```

Other actions: `fly_to`, `set_time`, `compare`, `open_site`, `show_results`, `ask_clarification`. Every `site_id` must exist in the registry; any raw coordinates must be validated (`lat` −90..90; `lon` −180..180). A model must **not** create archaeological geometry or new facts; it only chooses actions against trusted site and source records.

- Keep LLM credentials on the server; never embed them into `index.html`.
- Use a bounded retriever from approved site records and indexed sources. Return bibliographic citations rather than unsupported hallucinated facts.
- Avoid third-party geocoding calls for every keystroke. Provide a transparent online/offline status and a geocoder only when explicitly needed.
- Keep the deterministic local guide as a fully usable offline fallback.
- Accessibility: the same actions must work through text, keyboard, site cards, and globe pins.
