import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casesRouter from "./cases";
import documentsRouter from "./documents";
import findingsRouter from "./findings";
import categoriesRouter from "./categories";
import courtRouter from "./court";
import motionsRouter from "./motions";
import exportRouter from "./export";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casesRouter);
router.use(documentsRouter);
router.use(findingsRouter);
router.use(categoriesRouter);
router.use(courtRouter);
router.use(motionsRouter);
router.use(exportRouter);

export default router;
