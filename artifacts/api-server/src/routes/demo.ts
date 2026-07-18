import { Router } from "express";
import { getDemoCaseId, deleteAllDemoCases } from "../lib/seed";

const router = Router();

// Your existing route
router.get("/demo", async (_req, res) => {
  const caseId = await getDemoCaseId();
  if (caseId == null) {
    res.status(404).json({ error: "Demo case not found" });
    return;
  }
  res.json({ caseId });
});

// New route to delete all demo cases
router.post("/clear", async (_req, res) => {
  try {
    await deleteAllDemoCases();
    res.json({ success: true, message: "All demo cases successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete demo cases" });
  }
});

export default router;
