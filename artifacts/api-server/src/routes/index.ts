import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casesRouter from "./cases";
import documentsRouter from "./documents";
import findingsRouter from "./findings";
import categoriesRouter from "./categories";
import courtRouter from "./court";
import motionsRouter from "./motions";
import exportRouter from "./export";
import demoRouter from "./demo";
import patternRouter from "./pattern";
import reliefRouter from "./relief";
import nomeritRouter from "./nomerit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casesRouter);
router.use(documentsRouter);
router.use(findingsRouter);
router.use(categoriesRouter);
router.use(courtRouter);
router.use(motionsRouter);
router.use(exportRouter);
router.use(demoRouter);
router.use(patternRouter);
router.use(reliefRouter);
router.use(nomeritRouter);

router.post("/auth/login", (req, res) => {
  res.status(410).json({
    success: false,
    message: "Password login is disabled. Use the CaseLight demo entry point.",
  });
});

export default router;
