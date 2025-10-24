# Step 1 – Basic Server Setup

## 목표

- Node.js + Express로 간단한 외부 API 데이터 수집 서버 구현
- REST API 흐름 및 비동기 에러 처리 이해
- 응답 시간 및 결과 반환 구조 이해

---

## 프로젝트 개요

- **Express 서버** 구축
- **axios** 를 이용한 외부 API 호출
- **dotenv** 환경 변수 사용
- 요청 / 응답 시간 측정(`response_ms`)
- 기본 `try / catch` 구조로 에러 처리

---

## 실행 방법

### 1. 설치

```bash
npm install
```

### 2. 환경설정(.env)

```
PORT=8080
TARGET_URL=https://jsonplaceholder.typicode.com/posts
<!-- 위 TARGET_URL은 동작 확인용 테스트 주소입니다. -->
```

### 3. 실행

```bash
npm start
```

### 4. 테스트

브라우저 또는 터미널에서 아래 주소로 요청을 보냅니다

```bash
http://localhost:8080/collect
```

### 응답 예시

```json
{
  "ok": true,
  "result": {
    "status": "success",
    "response_ms": 180
  }
}
```

---

## 학습내용

- ChatGPT를 활용하여 서버의 요청-응답 흐름을 직접 타이핑하며 이해

- 에러를 의도적으로 발생시켜 catch 문이 어떻게 작동하는지 확인

1. .env파일에서 TARGET_URL을 일부러 잘못써서 오류 발생시키기(ENOTFOUND)

```
TARGET_URL=https://jsonplaceholder.typicodee.com/posts
```

2. collector.js는 에러를 catch했지만 throw 하지 않았기 때문에

```javaScript
 try {
    const res = await axios.get(target, { timeout: 10000 });
    const data = res.data;
    size = JSON.stringify(data).length;
  } catch (e) {
  //target(TARGET_URL)주소 에러로 정보를 받아올 수 없어 catch문 실행
    status = "fail";
    error = e.message;
  }
```

3. server.js에서는 오류가 아닌 “정상 응답”으로 처리됨 → ok: true

```javaScript
//server.js
app.get("/collect", async (_req, res) => {
  try { // 실행
    const result = await collectOnce();
    res.json({ ok: true, result });
  } catch (err) { //
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 서버 실행 후 http://localhost:8080/collect 확인 결과
{
  "ok": true,
  "result": {
    "status": "fail",
    "error": "getaddrinfo ENOTFOUND ..."
  }
}
```

- try / catch의 구조와 에러 전파 개념 학습
- Step 2에서는 Tor 네트워크 및 로그 기록 기능을 추가할 예정

이 프로젝트는 개인 학습 및 포트폴리오 용도로 제작되었습니다.
