// 🔑 API Key và Thành phố mặc định
const API_KEY = "6065e876077b800805afb4908e593bfa";
const DEFAULT_CITY = "Ho Chi Minh";
let lastSuccessfulCity = DEFAULT_CITY; // <-- THÊM BIẾN NÀY để sửa lỗi Refresh

// 🌍 Bảng ánh xạ tên tỉnh/thành Việt Nam
const VN_CITY_NAME_MAP = {
  "Ho Chi Minh": "Hồ Chí Minh",
  Hanoi: "Hà Nội",
  "Da Nang": "Đà Nẵng",
  "Hai Phong": "Hải Phòng",
  "Can Tho": "Cần Thơ",
  "An Giang": "An Giang",
  "Ba Ria-Vung Tau": "Bà Rịa - Vũng Tàu",
  "Bac Giang": "Bắc Giang",
  "Bac Kan": "Bắc Kạn",
  "Bac Lieu": "Bạc Liêu",
  "Bac Ninh": "Bắc Ninh",
  "Ben Tre": "Bến Tre",
  "Quy Nhon": "Bình Định",
  "Binh Duong": "Bình Dương",
  "Binh Phuoc": "Bình Phước",
  "Phan Thiet": "Bình Thuận",
  "Ca Mau": "Cà Mau",
  "Cao Bang": "Cao Bằng",
  "Dak Lak": "Đắk Lắk",
  "Dak Nong": "Đắk Nông",
  "Dien Bien": "Điện Biên",
  "Dong Nai": "Đồng Nai",
  "Dong Thap": "Đồng Tháp",
  "Gia Lai": "Gia Lai",
  "Ha Giang": "Hà Giang",
  "Ha Nam": "Hà Nam",
  "Ha Tinh": "Hà Tĩnh",
  "Hai Duong": "Hải Dương",
  "Hau Giang": "Hậu Giang",
  "Hoa Binh": "Hòa Bình",
  "Hung Yen": "Hưng Yên",
  "Nha Trang": "Khánh Hòa",
  "Kien Giang": "Kiên Giang",
  "Kon Tum": "Kon Tum",
  "Lai Chau": "Lai Châu",
  "Da Lat": "Lâm Đồng",
  "Lang Son": "Lạng Sơn",
  "Lao Cai": "Lào Cai",
  "Long An": "Long An",
  "Nam Dinh": "Nam Định",
  "Nghe An": "Nghệ An",
  "Ninh Binh": "Ninh Bình",
  "Ninh Thuan": "Ninh Thuận",
  "Phu Tho": "Phú Thọ",
  "Phu Yen": "Phú Yên",
  "Quang Binh": "Quảng Bình",
  "Quang Nam": "Quảng Nam",
  "Quang Ngai": "Quảng Ngãi",
  "Quang Ninh": "Quảng Ninh",
  "Quang Tri": "Quảng Trị",
  "Soc Trang": "Sóc Trăng",
  "Son La": "Sơn La",
  "Tay Ninh": "Tây Ninh",
  "Thai Binh": "Thái Bình",
  "Thai Nguyen": "Thái Nguyên",
  "Thanh Hoa": "Thanh Hóa",
  "Thua Thien Hue": "Thừa Thiên Huế",
  "Tien Giang": "Tiền Giang",
  "Tra Vinh": "Trà Vinh",
  "Tuyen Quang": "Tuyên Quang",
  "Vinh Long": "Vĩnh Long",
  "Vinh Phuc": "Vĩnh Phúc",
  "Yen Bai": "Yên Bái",
};

//Tạo danh sách tên tỉnh để dễ nhấn chọn
const cities = [
    "Hà Nội",
    "Thành phố Hồ Chí Minh",
    "Đà Nẵng",
    "Thanh Hóa",
    "Cần Thơ",
    "Huế",
    "Nha Trang",
    "Vinh",
    "Buôn Ma Thuột",
    "Phan Thiết",
    "Bình Định",
    "Long An",
    "Nam Định",
    "Hà Tĩnh",
    "Thái Nguyên",
    "Lâm Đồng",
    "Bắc Ninh",
    "An Giang",
    "Bến Tre",
    "Cà Mau"
];

function renderCities() {
    const box = document.querySelector(".cities");
    if (!box) return;

    box.innerHTML = "";

    cities.forEach(city => {
        const el = document.createElement("div");
        el.className = "city-item";
        el.textContent = city;

        el.addEventListener("click", () => {
            updateWeatherFromSidebar(city);
        });

        box.appendChild(el);
    });
}

renderCities();

function updateWeatherFromSidebar(cityName) {
    console.log("Đang load:", cityName);

    if (typeof fetchAndUpdateWeather === "function") {
        fetchAndUpdateWeather(cityName);
    }

    if (typeof fetchForecast === "function") {
        fetchForecast(cityName);
    }

    // Đóng sidebar trên mobile sau khi chọn thành phố
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    if (sidebar && main) {
        sidebar.classList.remove("open");
        main.classList.remove("dimmed");
    }
}

// 🌡️ Hàm mô tả cảm giác nhiệt độ
function getFeelStatus(feelsLikeC) {
  if (feelsLikeC >= 35) return "Rất Nóng (Khó Chịu)";
  if (feelsLikeC >= 30) return "Khá Nóng Bức";
  if (feelsLikeC >= 25) return "Ấm Áp";
  if (feelsLikeC >= 20) return "Mát Mẻ Dễ Chịu";
  if (feelsLikeC >= 15) return "Se Lạnh";
  if (feelsLikeC >= 10) return "Khá Lạnh";
  return "Rét Đậm";
}

// 🛠️ Cải tiến: Hàm tìm Key (tên tiếng Anh) từ Value (tên Tiếng Việt)
function getEnglishCityKey(vietnameseName) {
  const normalizedInput = vietnameseName.trim().toLowerCase();
  for (const [key, value] of Object.entries(VN_CITY_NAME_MAP)) {
    if (value.toLowerCase() === normalizedInput) {
      return key; // Trả về "Hanoi" nếu người dùng nhập "Hà Nội"
    }
  }
  return null; // Không tìm thấy
}
// 🛠️ Chuẩn hóa tên người dùng nhập để API hiểu (PHIÊN BẢN CẢI TIẾN)
function normalizeCityInput(userInput) {
  const text = userInput.trim().toLowerCase(); // 1. Kiểm tra các biệt danh HCMC

  const hcmList = [
    "tp hcm",
    "tphcm",
    "hcm",
    "sai gon",
    "saigon",
    "sg",
    "ho chi minh", // Giữ lại tên không dấu
    "tp hồ chí minh", // Thêm tên có dấu
  ];
  if (hcmList.includes(text)) return "Ho Chi Minh"; // 2. Thử tìm key từ tên Tiếng Việt (ví dụ: "Hà Nội" -> "Hanoi")

  const keyFromValue = getEnglishCityKey(userInput);
  if (keyFromValue) return keyFromValue; // 3. Nếu không, trả về giá trị gốc (coi như là tên tiếng Anh/không dấu)

  return userInput;
}
// Đổi màu nền
function updateWeatherBackground(weatherText) {
  const mainEl = document.querySelector("main.main");
  if (!mainEl) return;

  // Xóa class cũ
  mainEl.classList.remove(
    "weather-sunny",
    "weather-rain",
    "weather-cloud",
    "weather-snow",
    "weather-mist"
  );

  // Chuyển tiếng Việt -> không dấu
  const t = weatherText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (t.includes("nang") || t.includes("clear")) {
    mainEl.classList.add("weather-sunny");
  } else if (t.includes("mua") || t.includes("rain")) {
    mainEl.classList.add("weather-rain");
  } else if (t.includes("may") || t.includes("cloud")) {
    mainEl.classList.add("weather-cloud");
  } else if (t.includes("tuyet") || t.includes("snow")) {
    mainEl.classList.add("weather-snow");
  } else if (
    t.includes("suong") ||
    t.includes("mist") ||
    t.includes("fog") ||
    t.includes("haze")
  ) {
    mainEl.classList.add("weather-mist");
  } else {
    mainEl.classList.add("weather-sunny"); // fallback an toàn
  }
}
// 🌦️ Hàm gọi OpenWeatherMap API (PHIÊN BẢN SỬA LỖI HOÀN CHỈNH)
function fetchAndUpdateWeather(city) {
  const normalizedCity = normalizeCityInput(city); // ✅ Chuẩn hóa
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    normalizedCity
  )},VN&appid=${API_KEY}&units=metric&lang=vi`;

  const lastActionElement = document.getElementById("lastAction");
  lastActionElement.textContent = `Đang tải dữ liệu cho ${city}...`; // Xóa thông báo lỗi cũ (nếu có)

  document.getElementById("desc").textContent = "";

  fetch(url)
    .then((res) => {
      // --- XỬ LÝ LỖI HTTP ---
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("CityNotFound"); // Lỗi 404
        } else if (res.status === 401) {
          throw new Error("InvalidApiKey"); // Lỗi 401
        } else {
          throw new Error(`HTTP ${res.status}`); // Lỗi chung chung khác
        }
      }
      return res.json();
    })
    .then((data) => {
      console.log("✅ Dữ liệu thời tiết:", data); // <-- SỬA LỖI REFRESH: Lưu lại tên đã thành công

      lastSuccessfulCity = normalizedCity; // --- Lấy dữ liệu từ API ---

      const cityName = VN_CITY_NAME_MAP[data.name] || data.name;
      const currentTemp = Math.round(data.main.temp);
      const feelsLikeTemp = Math.round(data.main.feels_like);
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed.toFixed(1);
      const conditionText = data.weather[0].description;
      updateWeatherBackground(conditionText);
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      // Gọi AQI bằng tọa độ thành phố
      fetchAQI(data.coord.lat, data.coord.lon);
      const feelStatus = getFeelStatus(feelsLikeTemp); // --- Cập nhật giao diện ---

      document.getElementById("cityName").textContent = cityName;
      document.getElementById(
        "updated"
      ).textContent = `Cập nhật lúc: ${new Date().toLocaleTimeString("vi-VN")}`;
      document.getElementById(
        "temp"
      ).textContent = `Nhiệt độ thực tế: ${currentTemp}°C`;
      document.getElementById(
        "feels"
      ).textContent = `Cảm giác: ${feelStatus} (${feelsLikeTemp}°C)`;
      document.getElementById("humidity").textContent = `${humidity}%`;
      document.getElementById("wind").textContent = `${windSpeed} m/s`;
      document.getElementById("status").textContent = conditionText;
      document.getElementById(
        "icon"
      ).innerHTML = `<img src="${iconUrl}" alt="Icon thời tiết" style="width:100px;height:100px;">`;
      document.getElementById("desc").textContent = ""; // Xóa lỗi (nếu có)

      lastActionElement.textContent = `Hoàn tất lúc ${new Date().toLocaleTimeString(
        "vi-VN"
      )}`;
    })
    .catch((err) => {
      // --- BẮT VÀ HIỂN THỊ LỖI ---
      console.error("❌ Lỗi khi tải dữ liệu:", err.message);
      const descElement = document.getElementById("desc");
      const userCityInput =
        document.getElementById("searchInput").value || city;

      if (err.message === "CityNotFound") {
        lastActionElement.textContent = "Lỗi: Không tìm thấy thành phố!"; // Cập nhật giao diện chính để báo lỗi
        document.getElementById("cityName").textContent = "Không tìm thấy";
        document.getElementById("temp").textContent = "N/A";
        document.getElementById("feels").textContent = "Vui lòng thử lại";
        document.getElementById("status").textContent = "";
        document.getElementById("icon").innerHTML = ""; // Xóa icon
        descElement.textContent = `Không tìm thấy thành phố "${userCityInput}". Vui lòng kiểm tra lại tên.`;
      } else if (err.message === "InvalidApiKey") {
        lastActionElement.textContent = "Lỗi: API Key không hợp lệ!";
        descElement.textContent =
          "Lỗi xác thực API Key. Vui lòng kiểm tra lại.";
      } else {
        // Lỗi chung (ví dụ: mất mạng)
        lastActionElement.textContent = "Lỗi: Không tải được dữ liệu!";
        descElement.textContent = "Không thể kết nối. Vui lòng kiểm tra mạng.";
      }
    });
}

// =========================
// 🎋 TÍNH TOÁN VÀ HIỂN THỊ AQI
// =========================

// 🔹 Chuyển AQI số → mức độ
function getAqiStatus(aqi) {
  switch (aqi) {
    case 1: return "Tốt";
    case 2: return "Trung bình";
    case 3: return "Kém";
    case 4: return "Xấu";
    case 5: return "Rất xấu";
    default: return "Không xác định";
  }
}

// 🔹 Hàm gọi API AQI từ OpenWeatherMap
function fetchAQI(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const aqi = data.list[0].main.aqi;
      const status = getAqiStatus(aqi);

      // Cập nhật vào hộp AQI
      document.getElementById("aqiBox").textContent = `AQI — ${aqi} (${status})`;
    })
    .catch(err => {
      console.error("❌ AQI API error:", err);
      document.getElementById("aqiBox").textContent = "AQI — --";
    });
}

// --- Gắn sự kiện ---
window.addEventListener("load", () => fetchAndUpdateWeather(DEFAULT_CITY));

document.getElementById("locateBtn").addEventListener("click", () => {
  const currentCity =
    document.getElementById("searchInput").value || DEFAULT_CITY;
  fetchAndUpdateWeather(currentCity);
});

document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      fetchAndUpdateWeather(city);
      document.getElementById("searchInput").value = "";
      // Đóng sidebar trên mobile sau khi nhập tìm kiếm
      const sidebar = document.querySelector(".sidebar");
      const main = document.querySelector(".main");
      sidebar.classList.remove("open");
      main.classList.remove("dimmed");
    }
  }
});

// <-- SỬA LỖI REFRESH: Dùng 'lastSuccessfulCity'
document.getElementById("refreshBtn").addEventListener("click", () => {
  const lastActionElement = document.getElementById("lastAction"); // Lấy tên Tiếng Việt để hiển thị cho thân thiện
  const currentCityName =
    document.getElementById("cityName").textContent || lastSuccessfulCity;
  lastActionElement.textContent = `Đang làm mới dữ liệu cho ${currentCityName}...`; // Gọi API bằng tên tiếng Anh (không dấu) đã lưu
  fetchAndUpdateWeather(lastSuccessfulCity);
});

function fetchForecast(city) {
  const normalizedCity = normalizeCityInput(city);

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    normalizedCity
  )},VN&appid=${API_KEY}&units=metric&lang=vi`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("ForecastError");
      return res.json();
    })
    .then((data) => {
      console.log("📌 Forecast Data:", data);
      renderForecastChart(data);

      // Lấy mỗi ngày 1 mốc 12:00
      const dailyData = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      let html = "";

      dailyData.slice(0, 5).forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("vi-VN", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        });

        const tempMin = Math.round(item.main.temp_min);
        const tempMax = Math.round(item.main.temp_max);
        const desc = item.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        html += `
          <div class="forecast-item">
            <p class="f-date">${date}</p>
            <img src="${icon}" class="f-icon">
            <p class="f-desc">${desc}</p>
            <p class="f-temp">🌡 ${tempMin}°C – ${tempMax}°C</p>
          </div>
        `;
      });

      // Gắn vào HTML
      document.getElementById("forecast").innerHTML = html;
    })
    .catch((err) => {
      console.error("❌ Forecast error:", err);
      document.getElementById("forecast").innerHTML =
        "<p>Không tải được dự báo!</p>";
    });
}

// Gọi dự báo mỗi khi hiển thị thời tiết thành công
const _oldFetch = fetchAndUpdateWeather;
fetchAndUpdateWeather = function (city) {
  _oldFetch(city);
  fetchForecast(city);
};

$(document).ready(function () {

  // 1. Ẩn/hiện bảng danh sách thành phố khi click
  $(".sidebar-top .brand").click(function () {
    $("#citiesList").slideToggle(300); // slideToggle mượt mà
  });

  // 2. Thay đổi class khi hover các meta-item
  $(".meta-item").hover(
    function () {
      $(this).addClass("hovered"); // thêm class
    },
    function () {
      $(this).removeClass("hovered"); // xóa class khi rời
    }
  );

  // 3. Load dữ liệu mặc định (ví dụ: thông tin thành phố)
  function loadDefaultCity() {
    $("#cityName").text("Đang tải...");
    $("#temp").text("--°C");
    $("#feels").text("Cảm giác: --");
    $("#humidity").text("--%");
    $("#wind").text("-- m/s");
    $("#status").text("--");
    $("#icon").html("☀️");
  }
  loadDefaultCity();
  // 4. Hiển thị thông báo khi click "Vị trí của tôi"
  $("#locateBtn").click(function () {
    $("#lastAction").text("Đang xác định vị trí...");
    // Giả lập lấy vị trí
    setTimeout(() => {
      $("#lastAction").text("Vị trí đã được xác định!");
    }, 1000);
  });

  // 5. Toggle đơn vị (°C / °F)
  let isCelsius = true;
  $("#unitToggle").click(function () {
    isCelsius = !isCelsius;
    $(this).text(isCelsius ? "°C" : "°F");
    $("#lastAction").text(
      "Đơn vị nhiệt độ đã chuyển sang " + (isCelsius ? "°C" : "°F")
    );
    applyTemperatureUnit();
  });


  // =============================
// 🔥 CHUYỂN ĐỔI °C ↔ °F (BẢN ĐÃ SỬA)
// =============================

// Hàm chuyển đổi
function convertCtoF(c) { return (c * 9/5) + 32; }
function convertFtoC(f) { return (f - 32) * 5/9; }

// Hàm tách số nhiệt độ từ chuỗi (đã fix lỗi NaN)
function extractNumber(text) {
    return parseInt(text.replace(/\D+/g, "")); // ⚡ LẤY SỐ CHÍNH XÁC
}

// Cập nhật giao diện khi đổi đơn vị
function applyTemperatureUnit() {
    const tempEl = document.getElementById("temp");
    const feelsEl = document.getElementById("feels");

    if (!tempEl || !feelsEl) return;

    // ⚡ LẤY SỐ ĐÚNG CÁCH – KHÔNG BAO GIỜ NaN
    let temp = extractNumber(tempEl.textContent);
    let feels = extractNumber(feelsEl.textContent);

    if (!isCelsius) {
        // → Đổi sang °F
        temp = Math.round(convertCtoF(temp));
        feels = Math.round(convertCtoF(feels));

        tempEl.textContent = `Nhiệt độ thực tế: ${temp}°F`;
        feelsEl.textContent = feelsEl.textContent.replace(/\(.+\)/, `(${feels}°F)`);
    } else {
        // → Đổi sang °C
        temp = Math.round(convertFtoC(temp));
        feels = Math.round(convertFtoC(feels));

        tempEl.textContent = `Nhiệt độ thực tế: ${temp}°C`;
        feelsEl.textContent = feelsEl.textContent.replace(/\(.+\)/, `(${feels}°C)`);
    }
}



  // 1. Loading spinner khi refresh
  function showSpinner() {
    const spinner = $('<div class="spinner">⏳ Đang tải...</div>');
    $("body").append(spinner);
    spinner.fadeIn(200);
    return spinner;
  }

  function hideSpinner(spinner) {
    spinner.fadeOut(200, function () {
      $(this).remove();
    });
  }

  // 2. Click refresh => show spinner + giả lập load data
  $("#refreshBtn").click(function () {
    const spinner = showSpinner();
    $("#lastAction").text("Đang làm mới dữ liệu...");
    setTimeout(() => {
      $("#lastAction").text("Dữ liệu đã được làm mới!");
      hideSpinner(spinner);
    }, 1200);
  });

  // 3. Fade in/out cho thông báo lỗi ở desc
  function showError(msg) {
    $("#desc").text(msg).fadeIn(300).delay(2000).fadeOut(300);
  }

  

  // 4. Slide effect cho dự báo 7 ngày
  $(".forecast h3").click(function () {
    $("#forecast").slideToggle(400);
  });

  // 5. Hover icon thời tiết
  $("#icon").hover(
    function () {
      $(this).fadeTo(200, 0.6);
    },
    function () {
      $(this).fadeTo(200, 1);
    }
  );
});
//add de chay dt
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
const btnMenu = document.querySelector(".mobile-menu-btn");
const locateBtn = document.getElementById("locateBtn");

btnMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  main.classList.toggle("dimmed");
});

// Click vào main area  để đóng sidebar
main.addEventListener("click", () => {
  if (main.classList.contains("dimmed")) {
    sidebar.classList.remove("open");
    main.classList.remove("dimmed");
  }
});

document.querySelectorAll(".cities .city-item").forEach(item => {
  item.addEventListener("click", () => {
    sidebar.classList.remove("open");
    main.classList.remove("dimmed");
  });
});

locateBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
  main.classList.remove("dimmed");
  
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";   
  }
  if (typeof resetSearch === "function") {
    resetSearch();
  }
});
