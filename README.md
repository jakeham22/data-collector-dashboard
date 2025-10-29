# 🧩 Step 3-1 – 실시간 로그 스트림 (SSE)

## 🎯 목표

- 서버에서 수집 로그 파일(`collector.log`)의 변경을 실시간으로 감지
- **Server-Sent Events (SSE)** 를 통해 클라이언트에 실시간 데이터 전송
- **프론트엔드 대시보드**(`dashboard.html`)에서 로그를 실시간으로 표시

---

## 🧱 프로젝트 개요

- **Express** 기반 서버에 `/stream` 엔드포인트 추가
- `fs.watch` 로 로그 파일 변경 감지
- 브라우저와 **SSE(Server-Sent Events)** 로 실시간 통신
- `/public/dashboard.html` 에서 `EventSource` 로 로그 표시

---

## ⚙️ 실행 방법

### 1️⃣ 설치

```bash
npm install
```
