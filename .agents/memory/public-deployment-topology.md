---
name: Public deployment topology
description: The CaseLight custom domain is served by a Render static landing site, while the Replit artifact is only a local preview.
---

The public CaseLight domain is controlled by the Render static landing service, not by the Replit artifact deployment. The landing service must provide the analyzer entry point itself (currently `/app`) and analyzer API requests must target the Render API directly rather than relying on static-site `/api` rewrites.

**Why:** The custom domain can look healthy while serving only the landing bundle; links to an unserved `/app` path then fall back to the landing HTML or a browser download response.

**How to apply:** Before diagnosing a blank public app, inspect response headers and HTML to identify the serving platform, then verify the public landing build includes the actual analyzer route and uses the correct API origin.