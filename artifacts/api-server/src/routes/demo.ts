import { Router } from "express";
import { getDemoCaseId } from "../lib/seed";

const router = Router();

router.get("/demo", async (_req, res) => {
  const caseId = await getDemoCaseId();
  if (caseId == null) {
    res.status(404).json({ error: "Demo case not found" });
    return;
  }
  res.json({ caseId });
});

export default router;
