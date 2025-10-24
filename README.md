# 💻 Data Collector Dashboard

---

## 🎯 프로젝트 개요

**Data Collector Dashboard**는 웹 데이터 수집 프로세스를 자동화하고,

그 결과를 **실시간으로 모니터링·시각화**하며,

**에러율이 임계치에 도달하면 Slack과 Jira로 자동 알림**을 보내는

**데이터 품질 관리·운영용 모니터링 시스템**입니다.

---

## 🧠 주요 목적

- **웹 데이터 수집 자동화**
- **수집 성공률 / 실패율 실시간 모니터링**
- **수집 지연, 오류 발생 자동 탐지 및 알림**
- **운영 효율화 및 품질 개선**

---

## ⚙️ 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| **Backend** | Node.js, Express |
| **Scheduler** | Apache Airflow |
| **Storage / Search** | Elasticsearch |
| **Visualization** | Grafana |
| **Automation / Alerting** | Slack Webhook, Jira API |
| **Networking** | Tor Network (데이터 수집 우회) |
| **Frontend** | Chart.js (기본 대시보드 UI) |

---

## 🏗 시스템 아키텍처

```
[Airflow DAG] ──(주기 실행)──> [Collector API (Node/Express)]
                                   │
                      (Tor Proxy 통해 외부 데이터 수집)
                                   ▼
                         [Elasticsearch 인덱싱 저장]
                                   │
                 [Grafana 대시보드 (Elastic 데이터 소스)]
                                   │
        (수집 실패율 ↑) ──> [Slack 알림] & [Jira 이슈 생성]

```

---

## 📦 주요 기능

| 기능 | 설명 |
| --- | --- |
| **데이터 수집기 (Collector)** | Node.js + Express 기반 REST API (`/collect`, `/status`, `/metrics`) |
| **Tor 네트워크 연동** | 민감한 사이트나 차단된 URL도 프록시를 통해 안전하게 수집 |
| **Elasticsearch 저장소** | 수집 로그(성공/실패/응답속도 등)를 구조화해 저장 |
| **Grafana 대시보드** | Elasticsearch 데이터를 시각화하여 성공률/지연시간 모니터링 |
| **Airflow 스케줄러** | 5분 단위로 Collector API를 자동 호출 |
| **Slack / Jira 자동화** | 실패율이 임계치(예: 20%) 이상이면 Slack 알림 + Jira 이슈 자동 생성 |

---

## 📁 디렉토리 구조

```
data-collector-dashboard/
├── server.js              # Express 서버 진입점
├── collector.js           # 데이터 수집 로직 (Tor + Axios)
├── es.js                  # Elasticsearch 연결
├── notify.js              # Slack / Jira 통합
├── public/
│   ├── index.html         # Chart.js 대시보드 페이지
│   └── chart.js
├── dags/
│   └── collector_dag.py   # Airflow DAG 스케줄러
├── .env                   # 환경변수 (토큰, 포트, URL)
├── package.json
└── README.md

```

---

## 🔐 환경 변수 (.env)

```
PORT=8080
TARGET_URL=https://api.publicapis.org/entries

# Tor
TOR_SOCKS_HOST=127.0.0.1
TOR_SOCKS_PORT=9050

# Elasticsearch
ES_NODE=http://localhost:9200
ES_USERNAME=elastic
ES_PASSWORD=changeme
ES_INDEX_PREFIX=collector-logs

# Slack / Jira
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
JIRA_BASE=https://company.atlassian.net
JIRA_USER=you@example.com
JIRA_API_TOKEN=xxxxx
JIRA_PROJECT_KEY=DATA

```

---

## 📊 Grafana 패널 구성

| 패널 | 설명 |
| --- | --- |
| **Fail Rate (%)** | 최근 15분 간 실패 비율 |
| **Latency p95** | 응답 시간의 95퍼센타일 |
| **Status Donut** | 성공 / 실패 비율 시각화 |
| **Throughput** | 수집 요청 빈도 (per minute) |

---

## 🗓 Airflow DAG 설정

```python
schedule_interval="*/5 * * * *"  # 5분마다
task_id="run_collect"            # Collector API 호출
python_callable=call_collect      # REST API 요청 함수

```

---

## 🚨 알림 및 자동화 로직

- `/metrics` API에서 실패율 계산
- 실패율 20% 이상이면:
    - Slack 채널에 경고 메시지 전송
    - Jira 프로젝트(`DATA`)에 자동 버그 이슈 생성

---

## 🧩 확장 아이디어

- Docker Compose로 전체 환경 통합 실행
- Prometheus + Alertmanager 연동
- API Key 기반 인증 추가
- Elastic ILM으로 로그 자동 롤오버
- WebSocket 기반 실시간 업데이트

---

## 🧭 단계별 로드맵

| 단계 | 목표 | 핵심 포인트 | 완료 |
| --- | --- | --- | --- |
| **Step 1** | **Node.js 서버 + `/collect` 기본 동작** | Express 서버 구축, 공공 API 데이터 수집, 응답 시간/결과 반환 | 2025년 10월 23일 |
| **Step 2** | **Tor 연동 + 로그 저장** | SOCKS 프록시로 Tor 라우팅, 성공/실패 로그 파일 기록 |  |
| **Step 3** | **Elasticsearch 저장 + `/status` API** | 수집 결과 ES에 인덱싱, 최근 데이터 조회 API 구현 |  |
| **Step 4** | **Grafana 대시보드 구축** | ES 데이터 시각화 (성공률·지연 그래프) 패널 구성 |  |
| **Step 5** | **Slack + Jira 자동화** | 실패율 임계치 감지 → Slack 알림 + Jira 이슈 자동 생성 |  |
| **Step 6** | **Airflow 주기 실행 + 운영 스크립트 완성** | Airflow DAG 작성, 5분 주기 Collector API 자동 호출 |  |

---
