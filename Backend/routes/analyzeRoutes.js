import { Router } from "express";
import multer from "multer";
import { analyzeController } from "../controllers/analyzeController.js";

const router = Router();

// Use memory storage — images are NOT saved to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB hard limit at multer level
});

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "KrishiMitra AI backend is running" });
});

// Main analysis endpoint
router.post("/analyze", upload.single("image"), analyzeController);

export default router;
