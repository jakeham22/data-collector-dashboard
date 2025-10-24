import axios from "axios";
import "dotenv/config";

export async function collectOnce() {
  const startedAt = Date.now(); // 요청 보내기 직전 시점
  const target = process.env.TARGET_URL;

  let status = "success";
  let size = 0;
  let error = null;

  try {
    const res = await axios.get(target, { timeout: 10000 });
    const data = res.data;
    size = JSON.stringify(data).length;
  } catch (e) {
    status = "fail";
    error = e.message;
  }

  const result = {
    timestamp: new Date().toISOString(),
    target,
    status,
    response_ms: Date.now() - startedAt, // Date.now() : 응답 받은후, startedAt : 요청 보내기 직전
    size_bytes: size,
    error,
  };

  return result;
}
