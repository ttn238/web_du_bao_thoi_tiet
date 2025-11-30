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

  if (tempChart) tempChart.destroy();

  const gradientBlue = ctx.createLinearGradient(0, 0, 0, 300);
  gradientBlue.addColorStop(0, "rgba(59,130,246,0.45)");
  gradientBlue.addColorStop(1, "rgba(59,130,246,0)");

  const gradientRed = ctx.createLinearGradient(0, 0, 0, 300);
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
        },
        {
          label: "Nhiệt độ cao nhất (°C)",
          data: tempsMax,
          borderColor: "#EF4444",
          backgroundColor: gradientRed,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
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
        },
      },
      scales: {
        y: {
          ticks: { font: { size: 13 } },
        },
        x: {
          ticks: { font: { size: 13 } },
        },
      },
    },
  });
}

function renderForecastChart(forecastData) {
  if (!forecastData || !forecastData.list) return;

  const daily = forecastData.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  renderTemperatureChart(daily.slice(0, 5));
}

window.renderForecastChart = renderForecastChart;
