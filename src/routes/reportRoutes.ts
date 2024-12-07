import { Router } from "express";
import autoReportController from "../controllers/autoReportController";

const router = Router();

// Assign routes to controller methods
router.post("/generate-report", autoReportController.generateReport);
router.get("/list", autoReportController.getReports);
router.get("/:id", autoReportController.getReport);

export default router;
