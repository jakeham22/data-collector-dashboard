// Step 2: 수집 요청 처리 + 에러 응답
// 이제 catch문이 의도대로 작동

import express from "express";
import "dotenv/config";
import { collectOnce } from "./collector.js";

const app = express();
const PORT = process.env.PORT || 8080;

// 서버 상태 확인
app.get("/health", (_req, res) => res.json({ ok: true }));

// 실제 데이터 수집 API
app.get("/collect", async (_req, res) => {
  try {
    const result = await collectOnce();
    res.json({ ok: true, result });
  } catch (err) {
    // collector.js에서 전달 받은 에러 처리
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[step2] Server running on http://localhost:${PORT}`);
  console.log("Try visiting: http://localhost:" + PORT + "/collect");
});
