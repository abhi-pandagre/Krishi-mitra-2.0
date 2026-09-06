import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React frontend to call this backend during local development.
// Change FRONTEND_ORIGIN here when deploying.
const FRONTEND_ORIGIN = "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// All routes are prefixed with /api
app.use("/api", analyzeRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`KrishiMitra AI backend running on http://localhost:${PORT}`);
});
