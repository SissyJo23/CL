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
import authRouter from "./auth";
import { authMiddleware, rejectDemoWrites, requireAuth, requireCaseAccess } from "../lib/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
// The demo remains an explicit public read-only entry. All real workspace
// routes below require a verified account session.
router.use(demoRouter);
router.use(authMiddleware);
router.use(requireAuth);
router.use(requireCaseAccess);
router.use(rejectDemoWrites);
router.use(casesRouter);
router.use(documentsRouter);
router.use(findingsRouter);
router.use(categoriesRouter);
router.use(courtRouter);
router.use(motionsRouter);
router.use(exportRouter);
router.use(patternRouter);
router.use(reliefRouter);
router.use(nomeritRouter);

export default router;
