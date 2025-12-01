let tempChart = null;

function renderTemperatureChart(dailyData) {
  if (!dailyData || dailyData.length === 0) return;

  const labels = dailyData.map((item) => {
    const date = new Date(item.dt * 1000);
    const weekday = date
      .toLocaleDateString("vi-VN", { weekday: "short" })
      .replace(".", "");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${weekday} ${day}/${month}`;
  });

  const tempsMin = dailyData.map((item) => Math.round(item.main.temp_min));
  const tempsMax = dailyData.map((item) => Math.round(item.main.temp_max));

  const ctx = document.getElementById("tempChart").getContext("2d");

  const canvas = document.getElementById("tempChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  // Hủy chart cũ nếu tồn tại
  if (tempChart) tempChart.destroy();
  
  const gradientBlue = ctx.createLinearGradient(0, 0, 0, canvas.height || 300);
  gradientBlue.addColorStop(0, "rgba(59,130,246,0.45)");
  gradientBlue.addColorStop(1, "rgba(59,130,246,0)");

  const gradientRed = ctx.createLinearGradient(0, 0, 0, canvas.height || 300);
  gradientRed.addColorStop(0, "rgba(239,68,68,0.45)");
  gradientRed.addColorStop(1, "rgba(239,68,68,0)");

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nhiệt độ thấp nhất (°C)",
          data: tempsMin,
          borderColor: "#3B82F6",
          backgroundColor: gradientBlue,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Nhiệt độ cao nhất (°C)",
          data: tempsMax,
          borderColor: "#EF4444",
          backgroundColor: gradientRed,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}°C`,
          },
        },
        legend: {
          display: false, // ❌ tắt hoàn toàn legend
          position: "bottom",
        },
      },
      scales: {
        y: {
          ticks: { font: { size: 13 } },
          beginAtZero: false,
        },
        x: {
          ticks: { font: { size: 13 } },
        },
      },
    },
  });
// Tính khoảng (padding) cho trục Y để biểu đồ hiển thị hài hòa hơn
  const yMin = Math.min(...tempsMin) - 2;
  const yMax = Math.max(...tempsMax) + 2;
  tempChart.options.scales.y.min = Math.floor(yMin);
  tempChart.options.scales.y.max = Math.ceil(yMax);
  tempChart.update();
}

function renderForecastChart(forecastData) {
  if (!forecastData || !forecastData.list) return;

// Nhóm các mục dự báo theo ngày (YYYY-MM-DD) và tính min/max thực tế cho từng ngày
  const groups = {};
  forecastData.list.forEach((item) => {
    const d = new Date(item.dt * 1000);
    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
    if (!groups[key]) {
      groups[key] = { date: d, min: Infinity, max: -Infinity };
    }
    // Tính min/max qua tất cả các time slice trong ngày
    groups[key].min = Math.min(groups[key].min, item.main.temp_min);
    groups[key].max = Math.max(groups[key].max, item.main.temp_max);
  });

  const days = Object.values(groups)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5)
    .map((g) => ({ 
      dt: Math.floor(g.date.getTime() / 1000), 
      main: { temp_min: g.min, temp_max: g.max } 
    }));

  renderTemperatureChart(days);
}

window.renderForecastChart = renderForecastChart;
