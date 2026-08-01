---
name: GitHub sync
description: Durable workflow for synchronizing CaseLight changes with the remote main branch.
---

When the remote `main` branch advances during implementation, fetch and merge it before pushing; do not force-push because the repository contains concurrent frontend work.

**Why:** The remote branch can receive changes independently of the workspace, and the workspace GitHub push helper may report a misleading branch-exists error for an existing `main` branch.

**How to apply:** Verify the local/remote divergence, preserve newer remote workspace changes, resolve only real conflicts, and use the authenticated Git transport when the helper cannot push the existing branch.