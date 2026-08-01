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
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Force check your actual environment variables set up in Render
    if (email === process.env.APP_USERID && password === process.env.APP_PASSWORD) {
      return res.json({ 
        user: { 
          email, 
          userMode: "attorney", // This instantly forces the UI to unlock the "Upload document +" screens
          name: "Administrator" 
        } 
      });
    }

    res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
