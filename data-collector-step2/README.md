# Step 2 – Tor Network & Logging

## 목표

- Tor(SOCKS) 프록시를 통해 외부 API를 수집하는 방법 학습
- 수집 결과를 로컬 로그 파일에 기록 (`logs/collector.log`)
- 하위 모듈에서 에러를 상위로 전파(`throw`)하여 서버에서 처리하도록 구현

---

## 프로젝트 개요

- **axios** + **socks-proxy-agent** 를 사용한 Tor 경유 요청 구현
- 일반 / Tor 경유 요청 분기 처리 (`USE_TOR` 환경변수)
- `fs` 모듈로 수집 결과를 `logs/collector.log`에 누적 저장
- 에러 발생 시 `throw`로 server.js에 전달 → server.js에서 `ok:false` 응답 처리

---

## 실행 방법

### 1. 환경설정(.env)

Tor 브라우저(또는 tor 데몬)을 실행해야함
``` 
PORT=8080
TARGET_URL=https://jsonplaceholder.typicode.com/posts
USE_TOR=true   
```

```bash
tor 프록시 포트 확인 방법
1. tor 브라우저 실행 후 접속
2. cmd 또는 PowerShell에서 아래 커맨드라인 입력

# try 9150 first
curl --socks5-hostname 127.0.0.1:9150 https://check.torproject.org -I

# if fails, try 9050
curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org -I

응답 성공 : 헤더 표시, 응답 실패 : 에러 발생
```

### 2. 테스트

``` bash
npm start
```

``` bash
http://localhost:8080/collect
```

### 응답 예시

```json
성공
{
  "ok": true,
  "result": {
    "timestamp": "2025-10-24T10:00:00.000Z",
    "target": "https://jsonplaceholder.typicode.com/posts",
    "status": "success",
    "response_ms": 4123,
    "size_bytes": 53100,
    "error": null
  }
}

실패
{
  "ok": false,
  "error": "수집 실패: connect ECONNREFUSED 127.0.0.1:9150"
  }
```  
### logs/collector.log 예시

```
성공
[2025-10-24T10:00:00.000Z] status=success time=4123ms size=53100 target=https://jsonplaceholder.typicode.com/posts

실패
[2025-10-24T10:05:00.000Z] status=fail time=15ms size=0 target=https://jsonplacolder.typicode.com/posts
```

---

## 학습내용

- socks-proxy-agent를 사용해 axios 요청을 Tor SOCKS 프록시로 라우팅하는 방법
- try / catch / finally 패턴으로 에러 전파와 로그 기록을 보장하는 설계
- 로컬 로그 파일(fs.appendFileSync)로 수집 히스토리 보관 방법
- 운영 환경에서는 Tor 불안정성에 대비해 fallback(일반 요청 재시도) 로직을 고려해야 함

이 프로젝트는 개인 학습 및 포트폴리오 용도로 제작되었습니다.
