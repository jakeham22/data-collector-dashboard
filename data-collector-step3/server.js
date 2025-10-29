import express from "express";
import fs from "fs";
import { collectOnce } from "./collector.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

// 정적 파일 제공(대시보드 페이지)
app.use(express.static("public"));

// 데이터 수집 API(기존)
app.get("/collect", async (_req, res) => {
  try {
    const result = await collectOnce();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// STEP 3 추가 : 실시간 로그 스트림 (SSE)
app.get("/stream", (req, res) => {
  // SSE 헤더 설정
  /* flushHeaders() 함수
  보통 Express는 end() 함수가 호출될 때까지 헤더를 모아두었다가 한번에 보냄
  SSE(Server Sent Events)는 스트리밍 방식이라 헤더를 먼저 보내야 
  브라우저에서 실시간 스트림으로 인식하고 연결을 유지함 
  그래서 헤더를 먼저 설정하고 응답 헤더를 즉시 전송하는 flushHeaders() 함수를 사용하여 
  브라우저로 헤더를 전송함
  */
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // 초기 전송 (접속 성공 메세지)
  /* "data: ~" <- 브라우저에는 data가 출력되지 않는 이유
  "data:" SSE 프로토콜 문법 
  브라우저가 "이벤트 데이터"로 해석하고 "data:"다음의 내용만 이벤트 메세지 본문으로 전달
  */

  res.write("data: Connected to server\n\n");

  // 로그 파일 경로
  const logPath = "./logs/collector.log";

  // 파일 변경 감시
  const watcher = fs.watch(logPath, (eventType) => {
    if (eventType === "change") {
      const data = fs.readFileSync(logPath, "utf-8");
      const lastLine = data.trim().split("\n").pop();
      res.write(`data: ${lastLine}\n\n`);
    }
  });

  // 연결 종료 시 감시 중단
  req.on("close", () => {
    watcher.close();
    console.log("SSE 연결 종료됨");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
