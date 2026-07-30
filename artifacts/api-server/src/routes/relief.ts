import { Router } from "express";
import { db, reliefPathwaysTable, casesTable, findingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { anthropic } from "../lib/anthropic";

const router = Router();

// Helper to determine state and ladder
function getStateLadder(jurisdiction: string | null) {
  const j = (jurisdiction || "").toLowerCase();
  if (j.includes("wisconsin") || j.includes("wi")) {
    return {
      state: "WI",
      ladder: [
        { step: 1, court: "Circuit Court", description: "Trial level / Sentencing", status: "Completed" },
        { step: 2, court: "Court of Appeals", description: "Direct Appeal (Wis. Stat. § 808.03)", status: "Available" },
        { step: 3, court: "Wisconsin Supreme Court", description: "Petition for Review", status: "Available" },
        { step: 4, court: "U.S. District Court", description: "Federal Habeas (§ 2254)", status: "Available" },
        { step: 5, court: "7th Circuit Court of Appeals", description: "Federal Appellate Review", status: "Available" }
      ]
    };
  }
  // Default to General Ladder
  return {
    state: "Federal",
    ladder: [
      { step: 1, court: "Trial Court", description: "Judgment of Conviction", status: "Completed" },
      { step: 2, court: "Intermediate Appeals", description: "Direct Appeal", status: "Available" },
      { step: 3, court: "State Supreme Court", description: "Discretionary Review", status: "Available" },
      { step: 4, court: "Federal District Court", description: "Habeas Corpus", status: "Available" }
    ]
  };
}

router.get("/cases/:id/relief-pathway", async (req, res) => {
  const caseId = Number(req.params.id);
  
  const [caseRow] = await db.select().from(casesTable).where(eq(casesTable.id, caseId));
  if (!caseRow) return res.status(404).json({ error: "Case not found" });

  let [pathway] = await db.select().from(reliefPathwaysTable).where(eq(reliefPathwaysTable.caseId, caseId));

  if (!pathway) {
    const ladderInfo = getStateLadder(caseRow.jurisdiction);
    const findings = await db.select().from(findingsTable).where(eq(findingsTable.caseId, caseId));
    
    // Identify Federal Ready Claims (5th, 6th, 14th)
    const fedReady = findings.filter(f => 
      f.legalAnalysis.toLowerCase().includes("amendment") || 
      f.issueTitle.toLowerCase().match(/iac|brady|miranda|due process/)
    ).map(f => ({
      issueTitle: f.issueTitle,
      amendment: f.legalAnalysis.includes("6th") ? "6th" : "14th",
      readyReason: "Constitutional violation identified in record"
    }));

    [pathway] = await db.insert(reliefPathwaysTable).values({
      caseId,
      jurisdiction: caseRow.jurisdiction,
      ladderStatus: ladderInfo.ladder,
      federalReadyClaims: fedReady,
      aedpaTolled: false,
      aedpaIsEstimate: true
    }).returning();
  }

  res.json(pathway);
});

export default router;
