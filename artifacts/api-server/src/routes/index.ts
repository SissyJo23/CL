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

// This is your new Login Door
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // You can change 'admin@caselight.com' to your actual email later if you want.
  if (email === 'admin@caselight.com' && password === 'password123') {
    res.json({ 
      success: true, 
      token: "fake-jwt-token-for-now", 
      user: { email: 'admin@caselight.com', name: 'Christy' } 
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

export default router;
