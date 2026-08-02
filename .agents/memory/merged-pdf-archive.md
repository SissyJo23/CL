---
name: Merged PDF archive
description: What the uploaded merged CaseLight PDF contains and how to handle it safely.
---

The uploaded merged PDF is an archive/export of source files, database SQL, and workspace configuration. It is useful for recovering product structure and demo data, but it is not a reliable visual design reference.

**Why:** Representative pages showed source/configuration text rather than rendered product screens, and the export included sensitive configuration material.

**How to apply:** Do not reproduce, use, or expose credentials or configuration values found in the archive. Treat it as a recovery artifact only, and validate any recovered behavior against the current application and production API.