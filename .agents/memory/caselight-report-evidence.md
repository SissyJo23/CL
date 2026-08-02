---
name: CaseLight report evidence
description: What the uploaded CaseLight findings report proves about the original product output and how it differs from current production data.
---

The uploaded CaseLight report is a 972-page legal research report for State v. Lagerman, with 604 findings across 36 documents. Its defining output is a case-level report grouped by legal issue, where each finding includes a source reference, quoted record excerpt, legal analysis, authority and ruling, procedural status, anticipated block, and breakthrough argument.

The later repository/database archive is a different recovery source. Its SQL dump contains two Marcus Johnson demo cases, a trial transcript, court simulation, motion, and 14 findings total (7 per case). It does not contain the 604 Lagerman findings.

**Why:** The current production demo case can report `hasAnalysis: true` while its export contains one document and zero findings. Treating that case as representative of CaseLight hides the missing analysis dataset and produces an empty report.

**How to apply:** Use the uploaded report as the behavioral and information-architecture reference. Use the archive as a possible separate demo-data recovery source only after the user chooses a target. Validate any future analysis work by checking for nonzero persisted findings and the full evidence fields before calling the product restored.