---
name: Public deployment topology
description: The CaseLight custom domain is served by a Render static landing site, while the Replit artifact is only a local preview.
---

The public CaseLight domain is controlled by the Render static landing service, not by the Replit artifact deployment. The landing service must provide the analyzer entry point itself (currently `/app`) and analyzer API requests must target the Render API directly rather than relying on static-site `/api` rewrites.

**Why:** The custom domain can look healthy while serving only the landing bundle; links to an unserved `/app` path then fall back to the landing HTML or a browser download response.

**How to apply:** Before diagnosing a blank public app, inspect response headers and HTML to identify the serving platform, then verify the public landing build includes the actual analyzer route and uses the correct API origin. A successful push to GitHub is not proof of a Render deploy; verify the live asset hash and API behavior against the pushed revision.

Render's public landing and API services did not update after pushes to the repository's `main` branch during the August 1, 2026 verification. The live frontend continued serving the old login bundle and the live API continued accepting the retired password login, so Render's repository/branch or auto-deploy configuration must be checked before further code debugging.

**Why:** Treating a GitHub push as a deployment caused source fixes to be reported as live while the custom domain still served the previous build.

**How to apply:** After every public fix, compare the live bundle markers and API contract with the commit. If they remain old, stop feature work and repair/trigger the Render deployment first.

The public `/app` entry is a neutral CaseLight workspace home; only an explicit `/app/demo` link may open the demo case.

**Why:** Sending the primary app CTA directly into a demo case makes the product appear to belong to the wrong person and obscures the real case/workspace entry flow.

**How to apply:** Keep the landing CTA and analyzer root separate from demo routing. Never use the demo case as an implicit authentication or fallback destination.