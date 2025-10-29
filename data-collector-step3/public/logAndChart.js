// --- 그래프 초기화 ---
const ctxResponse = document.getElementById("responseChart");
const ctxStatus = document.getElementById("statusChart");

const responseData = {
  labels: [],
  datasets: [
    {
      label: "응답 시간(ms)",
      data: [],
      borderColor: "rgba(54, 162, 235, 1)",
      tension: 0.3,
    },
  ],
};

const responseChart = new Chart(ctxResponse, {
  type: "line",
  data: responseData,
  options: { scales: { y: { beginAtZero: true } } },
});

const statusData = {
  labels: ["성공", "실패"],
  datasets: [
    {
      data: [0, 0],
      backgroundColor: ["#4CAF50", "#F44336"],
    },
  ],
};

const statusChart = new Chart(ctxStatus, {
  type: "doughnut",
  data: statusData,
});

// --- 실시간 로그 스트림 연결 ---
const logsDiv = document.getElementById("logs");
const evtSource = new EventSource("/stream");

evtSource.onmessage = (event) => {
  const log = event.data;
  if (!log.includes("status=")) return; // "status="을 포함하는 로그만 파싱

  // 로그 표시
  const p = document.createElement("p");
  p.textContent = log;
  logsDiv.appendChild(p);
  logsDiv.scrollTop = logsDiv.scrollHeight;

  // 로그 파싱
  const statusMatch = log.match(/status=(\w+)/);
  const timeMatch = log.match(/time=(\d+)ms/);

  const status = statusMatch ? statusMatch[1] : "unknown";
  const time = timeMatch ? parseInt(timeMatch[1]) : 0;

  // 응답시간 차트 갱신
  const timestamp = new Date().toLocaleTimeString();
  responseData.labels.push(timestamp);
  responseData.datasets[0].data.push(time);
  if (responseData.labels.length > 10) {
    // 최신 로그 10개
    responseData.labels.shift();
    responseData.datasets[0].data.shift();
  }
  responseChart.update();

  // 상태 비율 갱신
  if (status === "success") statusData.datasets[0].data[0]++;
  else statusData.datasets[0].data[1]++;
  statusChart.update();
};
