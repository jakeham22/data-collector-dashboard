import axios from "axios";
import fs from "fs";
import { SocksProxyAgent } from "socks-proxy-agent";
import "dotenv/config";

// 로그 파일에 수집 결과를 기록하는 함수
function logToFile(entry) {
  const logDir = "./logs";

  // logs 폴더 없으면 자동 생성
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  // 한 줄씩 로그 파일에 추가
  fs.appendFileSync(`${logDir}/collector.log`, entry + "\n");
}

/* UTC → 한국 시간 변환
[2025-10-29T03:24:59.766Z] "Z" : UTC(협정 세계 시각) / 한국 : UTC+9
*/
function getKoreanTime() {
  return new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
}

// 실제 수집 작업 수행 함수
export async function collectOnce() {
  const startedAt = Date.now();
  const target = process.env.TARGET_URL; // 수집할 대상 URL
  const useTor = process.env.USE_TOR === "true";

  let status = "success";
  let size = 0;
  let error = null;

  try {
    let data;
    // Tor 네트워크 사용 여부에 따라 분기
    if (useTor) {
      console.log("[TOR] Tor 경유 요청 시도 (SOCKS proxy 사용)");

      // Tor의 로컬 SOCKS 포트: Tor 데몬은 보통 9050, Tor Browser 번들은 9150 등
      const agent = new SocksProxyAgent("socks5h://127.0.0.1:9150");

      // axios에 httpAgent/httpsAgent로 전달 (socks-proxy-agent는 Node에서 작동)
      const res = await axios.get(target, {
        httpAgent: agent,
        httpsAgent: agent,
        timeout: 30000,
      });
      data = res.data;
    } else {
      // 일반 axios 요청
      const res = await axios.get(target, { timeout: 80000 });
      data = res.data;
    }
    // 응답 데이터 크기 측정 (로그용)
    size = JSON.stringify(data).length;
  } catch (err) {
    status = "fail";
    error = err.message;
    console.log("[ERROR]", err);

    // 에러를 서버(server.js) 전달
    throw new Error(`수집 실패: ${error}`);
  } finally {
    // 수집 결과 로그 파일 기록
    const responseTime = Date.now() - startedAt;

    const logEntry = `[${getKoreanTime()}] status=${status} time=${responseTime}ms size=${size} target=${target}`;
    logToFile(logEntry);
  }

  // 최종 결과 반환 (서버에서 ok:true로 감싸서 응답)
  return {
    timestamp: new Date().toISOString(),
    target,
    status,
    response_ms: Date.now() - startedAt, // Date.now() : 응답 받은후, startedAt : 요청 보내기 직전
    size_bytes: size,
    error,
  };
}
