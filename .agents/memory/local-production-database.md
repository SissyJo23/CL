---
name: Local versus production database
description: Validation boundary between the workspace API database and the preserved Render database.
---

The workspace API may run against an uninitialized or different local database, while the Render API uses the preserved CaseLight production database. A local database error such as a missing table does not by itself diagnose production data or schema.

**Why:** Local route checks returned missing-table errors even though the production relief-pathway endpoint successfully read and created data from the existing CaseLight database.

**How to apply:** Validate frontend/build behavior locally, but validate production data-backed routes against the production API/database before concluding that preserved user data or production schema is broken.