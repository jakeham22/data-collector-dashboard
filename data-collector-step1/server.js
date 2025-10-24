import express from "express";
import "dotenv/config";
import { collectOnce } from "./collector.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/collect", async (_req, res) => {
  try {
    const result = await collectOnce();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[step1] Server running on http://localhost:${PORT}`);
  console.log("Try visiting: http://localhost:" + PORT + "/collect");
});
